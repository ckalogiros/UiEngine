"use strict";
import { FloorArr2, FloorArr3, Mult_arr3_scalar } from '../Helpers/Math/MathOperations.js';


import { DEBUG_PRINT_KEYS } from '../Engine/Controls/Input/Keyboard.js';

import { Dropdown_roots_set_root } from '../Engine/Drawables/Widgets/Widget_Dropdown.js';
import { Debug_info_create_ui_focused, Debug_info_create_ui_mouse, Debug_info_ui, Debug_info_ui_static, Debug_info_ui_static_app_generic_buffers_container, Debug_info_ui_static_app_generic_buffers, Debug_info_ui_static_app_int16_buffers, Debug_info_ui_static_app_int8_buffers, Debug_info_ui_static_more_performance_timers } from '../Engine/Drawables/DebugInfo/DebugInfoUi.js';
import { GetRandomColor, GetRandomInt, GetRandomPos, GetSequencedColor } from '../Helpers/Helpers.js';
import { Create_rect_mesh, Create_text_mesh, Create_widget_button, Create_widget_close_btn, Create_widget_color_picker, Create_widget_dropdown, Create_widget_label, Create_widget_menubar, Create_widget_minimize_btn, Create_widget_multi_text, Create_widget_scroller, Create_widget_section, Create_widget_slider, Create_widget_slider_simple, Create_widget_switch_button, Create_widget_switch_simple, Create_widget_text } from '../Engine/Core/CreateWidget.js';
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
import { Create_comet_particles, Create_explosion_particles, Create_glow_particles, Create_smoke_particles, Demo_glow_particles_test_dif_shaders } from './Demo/DemoParticles.js';
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
import { Tetris } from './Demo/Games/Snake/Tetris.js';
import { Bitwise_operations_run_test } from '../Engine/Core/BitwiseOps.js';
import { Arkanoid_initialize } from './Demo/Games/Arkanoid/Arkanoid.js';
import { Widget_ready_label, Widget_ready_rect, Widget_ready_slider, Widget_ready_slider_simple, Widget_ready_switch, Widget_ready_switch_button } from './Widgets/WidgetReadyWidgets.js';
import { Effects_create_explosion_circle, Effect_explosion_circle_get_mesh_byidx } from '../Engine/Drawables/Effects/Effects.js';
import { Widget_gfx_ready_enable, Widget_gfx_ready_enable_default } from './Widgets/WidgetGfxReady.js';
import { CALLBACK_ANIMATION_TYPE_FLAGS, CALLBACK_ANIMATION_TYPE_IDX, Callback_animations_create_specific } from '../Engine/Animations/CallbackAnimationsReadyAnimations.js';
import { Align_expand, Align_pre_simple, Test_alignment, Test_alignment_nested_2 } from './Tests/TestAlignNestedSections.js';
import { Performance_timer_start, Performance_timer_stop, PerformanceTimersGetFps, PerformanceTimersGetMilisec } from '../Engine/Timers/PerformanceTimers.js';
import { Texture_metrics_get_sub_tex_width, Texture_metrics_get_line_height } from '../Engine/Loaders/Textures/TextureUvMap.js';
import { Expand } from '../Engine/Drawables/Meshes/Section.js';
import { Style_button_default_properties, Style_dropdown_default_properties, Style_label_default_properties, Style_rect_default_properties, Style_section_default_properties, Style_slider_default_properties, Style_slider_simple_default_properties, Style_switch_button_default_properties, Style_switch_default_properties } from '../Engine/Drawables/Widgets/WidgetReadyStyles.js';


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


    let ypos = 0
    let xpos = 10


    // Bitwise_operations_run_test();

    { // Statistics
        let yy = 0, pp = 23;
        // const d1 = Debug_info_ui_static(ROOT_WIDGETS.CREATE_ROOT, yy); yy += d1.geom.dim[1] * 2
        // const d2 = Debug_info_ui_static_more_performance_timers(ROOT_WIDGETS.CREATE_ROOT, 0, yy); yy += d2.geom.dim[1]*2
        // const d4 = Debug_info_create_ui_mouse(_, yy); yy += d4.geom.dim[1]*2
        // const d5 = Debug_info_ui_static_app_generic_buffers_container(ROOT_WIDGETS.CREATE_ROOT, 0, yy);yy += d5.geom.dim[1]*2
        // const d6 = Debug_info_ui_static_app_generic_buffers(ROOT_WIDGETS.CREATE_ROOT, 0, yy); yy += d6.geom.dim[1]*2
        // const d7 = Debug_info_ui_static_app_int16_buffers(ROOT_WIDGETS.CREATE_ROOT, 0, yy); yy += d7.geom.dim[1]*2
        // const d8 = Debug_info_ui_static_app_int8_buffers(ROOT_WIDGETS.CREATE_ROOT, 0, yy); yy += d8.geom.dim[1]*2
        // const d3 = Debug_info_ui(ROOT_WIDGETS.CREATE_ROOT, 20, yy); yy += d3.geom.dim[1]*2
    }



    // Test_align_many_sliders()

    // Demo_page();
    // Demos_welcome_menu();

    { // Games
        Arkanoid_initialize();
        // Tetris(ROOT_WIDGETS.CREATE_ROOT, 20, 132);
        // Game_snake(45, true);
    }



    // Test: Alignment
    // Test_alignment();

    // Test: Measure performance of the 2 kinds of section auto-alignment
    // Test_performance_align_functions()

    /*************************************************************************************************************************/
    // Test Widgets
    { // widget plain text
        // CreateSimpleWidgetText()
        // CreateTextInSectionWithNewLine();
    }

    
    { // Widget: Label-buttons
        
        { // MSDF with scale slider
            // Demo_widgets_msdf_text_rendering(10, 100);
        }
        
        // CreateLabel(_, '|_A_B_C_D_E_F_G_H_J_T_Y_U\n_a_b_c_d_e_f_g_h_i_t_r', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 700,_,_,_,18);
        // CreateLabel(_, '|_A_B_C_D_E_F_G_H_J_T_Y_U\n_a_b_c_d_e_f_g_h_i_t_r', TEXTURES.MTSDF_COMIC_1024, _, 300, 700,_,_,_,18);
        // CreateLabel(_, '| Initializing Graphics.', TEXTURES.CONSOLA_VARIANT_FONT, ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S10_0, 300, 50,_,_,_,75,);
        // CreateLabel(_, 'Widget_Label\n12345\nppao918827', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 50,_,_,_);
        // CreateLabel(_, 'Widget_Label\n12345\nppao918827', TEXTURES.CONSOLA_VARIANT_FONT, ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S1_5, 300, 50, _, _, _);
        // Widget_ready_label(ROOT_WIDGETS.CREATE_ROOT, '|_A_B_C_D_E_F_G_H_J_T_Y_U\n_a_b_c_d_e_f_g_h_i_t_r', TEXTURES.MTSDF_CONSOLAS_1024, 300, 100,_,_,_,18);
        
        // Render font symbols atlas texture
        // Render_font_symbols_atlas_texture(30, 50);    
        
        // Test: Set Focused
        // CreateSectionedWidgets([100, 20, 0], 'Section 1')
        // CreateSectionedWidgets([100, 170, 0], 'Section 2')


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
        // CreateSlider(_, 400, 100);
        // Widget_ready_slider(ROOT_WIDGETS.CREATE_ROOT, 20, 20, _, 'GFDFD', _, )

        // CreateSwitchSimple([0, ypos, 0]);
        // const switch1 = CreateSwitch();
        // Widget_ready_switch(ROOT_WIDGETS.CREATE_ROOT, 100, 100)
        // Widget_ready_switch_button(ROOT_WIDGETS.CREATE_ROOT, );
    }

    { // Textured Meshes
        // TexturedRect(ROOT_WIDGETS.CREATE_ROOT, _, 30, 30, [256/2, 256/2], WHITE, [0,0], TEXTURES.SMOKE_1);
        // TexturedRect(ROOT_WIDGETS.CREATE_ROOT, _, 30, 30, [32/2, 32/2], WHITE, [0,0], TEXTURES.COIN);
        // TexturedRect(ROOT_WIDGETS.CREATE_ROOT, _, 30, 30, [64/2, 73/2], WHITE, [0,0], TEXTURES.TEST_APPLE);
    }

    { // Test sdf lines
        // const line1 = SdfLine(YELLOW[7], [50, 250, 1], [200, 5]);
    }

    { // Resize section
        // SectionResizable([50, 150, 0])
    }

    { // Widget: Dropdown

        // TEST_LISTENERS_CreateDropdown([400, 200, 0])

        // CreateDropdownTree([0, 0, 0])
        // CreateDropdownTreeHorizontalLayout();

        // TestAlignNew([0, 200, 0])
        // Demo_complicated_widget_layout([0, 200, 0])
        // TODO:UN_IMPLEMENTED
        // CreateDropdown2InSection([0, ypos+=40, 0], 0);
        // TODO:UN_IMPLEMENTED
        // CreateDropdown3([0, ypos+=40, 0], 0);
    }

    { // Widget: Scroller

        // const scroller = CreateScrollerClampAlphaTest(_, 100, 100, 100, 12)

        // TODO:UN_IMPLEMENTED
        // TestScrollerComponentDropdown();

        // TODO:UN_IMPLEMENTED
        // TestScrollerComponent2(); // TODO: Uses double scroller and does NOT work properly 

        // TODO:UN_IMPLEMENTED
        // TestScrollerComponent3(); // TODO: Uses nested scrollers and does NOT work properly

    }

    { // Widget: Colorpicker

        // Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, 0, 100, _, _, _, _, _, _, 0x0);

        /* Test change color of a mesh using the colorpicker */
        {
        //     const rect = Create_widget_section(Style_section_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, options: SECTION.VERTICAL, pad: [0, 0], pos: [10, 380, 0], dim: [200, 80], col: TRANSPARENCY(GREEN[2], 1.), name: 'ColorPicker' }));
        //     rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
        //     // rect.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        //     rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        //     rect.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 15);
        //     rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        //     rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
        //     rect.Render();
        //     Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);
        //     rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx)
        //     Construct_listen_events_from_mesh_tree(rect)
        //     Construct_listen_events_relations_from_mesh_tree(rect);

        //     Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);
        //     rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
        //     Construct_listen_events_from_mesh_tree(rect);
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
        }

        /** Colorpicker Instanced Geometry*/
        // Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, 0, 100, _, _, _, _, _, _, SID.ATTR.WPOS3|SID.ATTR.DIM2)
        // Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, 0, 100, _, _, _, _, _, _, SID.ATTR.DIM2)

    }

    { // Window menu
        // TODO:UN_IMPLEMENTED -> The symbol texture is not a part of root window menu
        // Window_menu();
    }




    /*************************************************************************************************************************/
    // Test Interactions-Animations
    
    { // Annimations
        
        { // Rotation: Rotate sdf line. Dont forget to disable the 'style' attribute
            // Test_rotate_section_with_round_corners();
        }

        { 
            // Demo_clbk_animations_text_counter(ROOT_WIDGETS.CREATE_ROOT, true, );
        }

        { // Callback Animations
            // Demo_animations_ready_button_anim(ROOT_WIDGETS.CREATE_ROOT, 20, 20, CALLBACK_ANIMATION_TYPE_FLAGS.SCALE);
            // Demo_animations_ready_button_anim(ROOT_WIDGETS.CREATE_ROOT, 20, 220, CALLBACK_ANIMATION_TYPE_FLAGS.MOVE_XY);
            // Demo_animations_ready_button_anim(ROOT_WIDGETS.CREATE_ROOT, 20, 420, CALLBACK_ANIMATION_TYPE_FLAGS.MOVE_XY|CALLBACK_ANIMATION_TYPE_FLAGS.SCALE);
        }

        { // Mesh Animations

            // const label = Widget_ready_label(ROOT_WIDGETS.CREATE_ROOT, '[ HELLO ] !!!', TEXTURES.MTSDF_COMIC_1024, 300, 50, 20, _, _, _, _, _);
            // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, label, .03, 0., 1.)

            // const line = SdfLine(GREEN[7], [300, 300, 5], [200, 10], SID.ATTR.COL4|SID.ATTR.WPOS3);
            // const line = SdfLine(GREEN[7], [300, 300, 5], [200, 10]);
            // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, line, .01, .1, 1., _, .5, false)
            // Mesh_animations_create(ANIMATIONS.TYPE.WPOS|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.POS.XY, line, .5, -5., 5., 0)
            // Mesh_animations_create(ANIMATIONS.TYPE.WPOS|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.POS.X, line, .5, -5., 5., 0)
            // Mesh_animations_create(ANIMATIONS.TYPE.WPOS|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.POS.Y, line, .5, -5., 5., 0)
            // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RGB, line, .004, .4, .8, _, .8, true)
            // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, line, .05, .4, 1.,)
            // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, line, .005, .2, .5, .2)
            // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, line, .0025, .2, .8, .2)
            // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RG, line, .01, .2, .8, _, .2, false)
            // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, line, .001, .2, 1.4, _, .4, true)
            // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, line, .001, .2, 1.4, _, .4, true)

        }
    }



    /*************************************************************************************************************************/
    // Test more complex structures

    { // Section Synthesizes 
        // TestSections1();

        // CreateManySections();

        // CreateManySectionsMinimal()
    }


    // NOT YET TESTED AND CORRECTED WITH NEW WIDGET CREATION STYLE

    { // Reload
        // Test_reload_app();
    }

    { // DEMOS

        { // Demo Particles 

            // Create_glow_particles(VIEWPORT.RIGHT-270, 0, ROOT_WIDGETS.CREATE_ROOT, true, 1);

            // Demo_glow_particles_test_dif_shaders(VIEWPORT.RIGHT-270, 0, ROOT_WIDGETS.CREATE_ROOT, _, true, 1);

            // Create_explosion_particles(0, 0, ROOT_WIDGETS.CREATE_ROOT, true, 256)

            // Create_smoke_particles();

            // Create_comet_particles(_, _, 300, 300, 1, ROOT_WIDGETS.CREATE_ROOT, true, 28, );

        }

        { // Demos Physics

            // const total_height = Elastic_collisions(0, 0, ROOT_WIDGETS.CREATE_ROOT, true);

            // Sattelite_rotation([0, 100]);

        }

        { // Demos Widgets

            let y = 0;
            const pad = 50;

            /* section/rect move */
            /* sections - hovering (no moving so that for android devices can hover on touch) */
            // const sections = Demo_widgets_sections(_, [0, 100]);
            // y += sections.geom.dim[1]*2 + pad;

            // /** Explainer Info */
            // const info = Demo_widgets_explainer_info([100,100])
            // y += info.geom.dim[1]*2 + pad;

            // /* Demo Widgets */
            // const btn = Demo_widgets(_, [0, y]);
            // y += btn.geom.dim[1]*2 + pad;
            

            // /* scrolling */
            // const scroller = Demo_widgets_scrolled_labels(_, [0, y]);
            // y += scroller.geom.dim[1]*2 + pad;


            // /* dropdown - move - hover */
            // const dp = Demo_widgets_dropdown(_, [0, y], )
            // y += dp.geom.dim[1]*2 + pad;


            // /* Colorpicker */
            // const colorpicker = Demo_widgets_colorpicker_demo_with_info(_, 0);

            // /* Coloring per vertex */

            // /* Resizable widgets */


            // { // Create the button for going to the top

            //     const btn = Create_widget_button(ROOT_WIDGETS.CREATE_ROOT, 'Up', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [VIEWPORT.RIGHT - 100, VIEWPORT.BOTTOM - 80, 0], _, GREY[10], TRANSPARENCY(BLUEL[7], 1.), [5, 5], .5, [0, 24, 1.8], TEXTURES.CONSOLAS_32px);
            //     btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
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
            //     btn.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
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
                // Demo_animations_text();

                { // Text Animations Testing
                    { // All
                        // Test_text_clbk_animations_with_counter(100, 100, 10, 10, CLBK_ANIMATIONS.TEXT_SQUEEZE_X, );
                        // Test_text_clbk_animations_with_counter(200, 100, 10, 10, CLBK_ANIMATIONS.TEXT_SQUEEZE_Y, );
                        // Test_text_clbk_animations_with_counter(300, 100, 10, 10, CLBK_ANIMATIONS.TEXT_TRANSLATE_X, );
                        // Test_text_clbk_animations_with_counter(400, 100, 10, 10, CLBK_ANIMATIONS.TEXT_TRANSLATE_Y, );
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

    { // Coloring
        // Test_hsv_color_sequence_from_integer_input();

        // { // TEST MULTI VERTEX MESH
        //     /******************************************************************************/
        //     // Create the hue picker mesh
        //     const HUE_COLOR = [
        //         RED[9], RED[9],
        //         YELLOW[9], YELLOW[9],   // v3-v4
        //         GREEN[9], GREEN[9],   // v3-v4
        //         CYAN[9], CYAN[9],   // v3-v4
        //         BLUE[9], BLUE[9],   // v5-v6
        //         MAGENTA, MAGENTA,   // v3-v4
        //         RED[9], RED[9],
        //         YELLOW[9], YELLOW[9],   // v3-v4
        //         GREEN[9], GREEN[9],   // v3-v4
        //         CYAN[9], CYAN[9],   // v3-v4
        //         BLUE[9], BLUE[9],   // v5-v6
        //         MAGENTA, MAGENTA,   // v3-v4
        //         RED[9], RED[9],

        //         BLUE[9], BLUE[9],   // v5-v6
        //         GREEN[9], GREEN[9],   // v3-v4
        //         RED[9], RED[9],
        //         BLACK, BLACK,
        //         WHITE, WHITE,
        //     ];

        //     const scale = 1;
        //     // const dim = [300, 120]
        //     const dim = [VIEWPORT.WIDTH/2, VIEWPORT.HEIGHT/6]
        //     const vertices_count = (HUE_COLOR.length / 2) - 1;
        //     const slider_hue = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0,0], [0, 0, 2], dim, HUE_COLOR, _, _, vertices_count);
        //     // const slider_hue = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0,0], [0, 0, 2], [dim[0], 20], HUE_COLOR, _, _, 4);
        //     // const slider_hue = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, [0, 0, 2], [dim[0], 20], HUE_COLOR, _, _, _, vertices_count);
        //     slider_hue.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        //     slider_hue.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
        //     slider_hue.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 4);

        //     slider_hue.sid.shad |= SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X;
        //     // slider_hue.children.buffer[0].sid.shad |= SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X; // Set the handle
        //     slider_hue.StylesSetMargin([0, 20]);
        //     slider_hue.SetName('Slider Hue');

        //     slider_hue.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        //     slider_hue.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);

        //     slider_hue.Render();

        //     Root_group_activate_all_vbs_in_renderqueue(slider_hue.root_bufferidx);
        //     slider_hue.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider_hue.gfx.vb.groupidx);
        //     Construct_listen_events_from_mesh_tree(slider_hue);
        //     Construct_listen_events_relations_from_mesh_tree(slider_hue);

        // }
    }

    { // Shaders Tests
        // Test_shaders_test1();
        // Test_shaders_test2();
        // Test_shaders_test3();
        // Test_shaders_test4();

        // Test_shaders_operations();

        // Test_shaders_operations_outer_glow_rect();
    }

    { // Shader Operations

        // Test_shaders_operations_sdf_rect();

        // Test_shaders_inner_shadow_rhomboid_effect();
        // Test_shaders_Shadow_specular();
        // Test_shaders_bubble_flare();

        // Shader_color_functions_glow_sphere();
        // Shader_color_functions_worley_1_noise();
        // Shader_color_functions_worley_2_noise();
        // Shader_color_functions_worley_3_types_noise();

        // Shader_color_functions_voronoi_1_noise();
        // Shader_color_functions_voronoi_2_noise();

        // Shader_color_functions_blend_simple_noise_with_voronoi();

        // Shader_color_functions_noise_test();

        // TODO: Create particles with explosion circle and animate the timer
        // Shader_color_functions_explosion_circle(100, 0);

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
    // const helpui = Help();



    // // Test Quadratic_interpolation
    // console.log('Quadratic_interpolation');
    // const max=40, min=30;
    // console.log('val:0', Quadratic_interpolation(min, max, min));
    // console.log('val:1', Quadratic_interpolation(min, max, min+((max-min)/2)));
    // console.log('val:2', Quadratic_interpolation(min, max, max));
}






/**************************************************************************************************************************************/
// Widget Creation Functions
function Test_reload_app() {

    const reload_btn = Create_widget_button(ROOT_WIDGETS.CREATE_ROOT, 'Reload', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [VIEWPORT.RIGHT - 140, 10, 0], _, GREY[10], TRANSPARENCY(BLUEL[7], 1.), [5, 5], .5, [0, 24, 1.8], TEXTURES.CONSOLAS_32px);
    reload_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    reload_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

    reload_btn.Bind(
        (params) => {

            Callback_animations_create( // Scroll Up
                (params) => { // Run Animation

                    // window.location.reload(false, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<sjksjhjdks>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'); 

                    App_reset();
                    App_reinitialize();
                    // const label = CreateLabel('1');
                    // Demo_ball_tail();
                    // const dbg_dp = Debug_info_ui(ROOT_WIDGETS.CREATE_ROOT);
                    Debug_info_ui_static();

                    createId++; // The id is for rendering a different
                    TestWidgetsGeneric()

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
    reload_btn.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
    reload_btn.Render()
    Root_group_activate_all_vbs_in_renderqueue(reload_btn.root_bufferidx);

    reload_btn.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, reload_btn.gfx.vb.groupidx)

    Construct_listen_events_from_mesh_tree(reload_btn)
    Construct_listen_events_relations_from_mesh_tree(reload_btn);
}

function Test_rotate_section_with_round_corners() {

    const line1 = SdfLine(GREEN[7], [300, 300, 5], [200, 10], _, true);
    Time_intervals_create(16, 'TEST ROTATION', TIME_INTERVAL_REPEAT_ALWAYS, (params) => {
        const mesh = params.params
        // const t = (Timer_get_global_timer_cycle()-.5)*10;
        const rot = (Timer_get_global_timer()) * 1;
        mesh.RotateZ(rot);
        Gl_set_angle(mesh.gfx, rot);

    }, line1)

}






/**************************************************************************************************************************************/
// Widget Creation Functions

const fontsize = 12;

function Test_hsv_color_sequence_from_integer_input() {
    const text = 'FPS:11999 Meshes:19 Active:14?'

    let y = 10, x = 0, i = 1;
    const label = CreateLabel(ROOT_WIDGETS.CREATE_ROOT, text, TEXTURES.CONSOLAS_12px, 30, y, RGB(i)); y += 35; i++;
    y -= 10;
    const vb_groupidx = label.gfx.vb.groupidx, text_vb_groupidx = label.text_mesh.gfx.vb.groupidx;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;
    CreateLabel(_, text, TEXTURES.CONSOLAS_12px, x, y, RGB(i), vb_groupidx, text_vb_groupidx); y += 35; i++;

}

function Test_text_clbk_animations_with_counter(x, y, text_pad_x = 10, text_pad_y = 6, clbk_anim_flag = CLBK_ANIMATIONS.TEXT_TRANSLATE_Y, speed = 10, slope = .1) {

    // const mesh = Create_widget_button(ROOT_WIDGETS.CREATE_ROOT, '0', _, [140, 180, 0], _, BLUEL[9], WHITE, [10, 86], _, _, TEXTURES.CONSOLAS_32px);
    const mesh = Create_widget_label(Style_label_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, text:'1', pos:[x, y, 0], col:BLUEL[9], text_pad:[text_pad_x, text_pad_y], texture_id:TEXTURES.CONSOLAS_32px,}));
    Widget_gfx_ready_enable({mesh:mesh, enable_sdf_rect:10, enable_col_per_vertex:COLOR_GRADIENT_VERTICAL(BLUEL[3], BLUEL[9])})
    mesh.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    mesh.align.flags = (ALIGN_2.VERTICAL);

    mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    mesh.Render();
    mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.groupidx)
    Construct_listen_events_from_mesh_tree(mesh);
    Construct_listen_events_relations_from_mesh_tree(mesh);
    Root_group_activate_all_vbs_in_renderqueue(mesh.root_bufferidx);

    // Auto Create Animation(Only for button meshes, calls .Bind to trigger on click)
    // Demo_clbk_animations_text_counter(ROOT_WIDGETS.CREATE_ROOT, mesh, true);

    const slope_params_pointer = Demo_clbk_animations_create_transition_slope(_, slope, speed);

    let cnt = 0;

    Time_intervals_create(700, 'TEST_text_animation', TIME_INTERVAL_REPEAT_ALWAYS,
        () => {

            if (cnt > 9) cnt = 0;
            const text_substitution = `${cnt++}`

            let limit = 0;
            if (clbk_anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_X | CLBK_ANIMATIONS.TEXT_TRANSLATE_X)) limit = Texture_metrics_get_sub_tex_width(mesh.text_mesh.mat.metrics_idx, text_substitution.charCodeAt(0) - CHAR_ARRAY_START_OFFSET) / 2;
            else if (clbk_anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_Y | CLBK_ANIMATIONS.TEXT_TRANSLATE_Y)) limit = Texture_metrics_get_line_height(mesh.text_mesh.mat.metrics_idx) / 2;

            if (clbk_anim_flag & CLBK_ANIMATIONS.TEXT_TRANSLATE_X) Demo_clbk_animations_text_create(mesh, slope_params_pointer, limit, 'TESTETESTTEST', CLBK_ANIMATIONS.TEXT_TRANSLATE_X, text_substitution);
            if (clbk_anim_flag & CLBK_ANIMATIONS.TEXT_TRANSLATE_Y) Demo_clbk_animations_text_create(mesh, slope_params_pointer, limit, 'TESTETESTTEST', CLBK_ANIMATIONS.TEXT_TRANSLATE_Y, text_substitution);
            if (clbk_anim_flag & CLBK_ANIMATIONS.TEXT_SQUEEZE_X) Demo_clbk_animations_text_create(mesh, slope_params_pointer, limit, 'TESTETESTTEST', CLBK_ANIMATIONS.TEXT_SQUEEZE_X, text_substitution);
            if (clbk_anim_flag & CLBK_ANIMATIONS.TEXT_SQUEEZE_Y) Demo_clbk_animations_text_create(mesh, slope_params_pointer, limit, 'TESTETESTTEST', CLBK_ANIMATIONS.TEXT_SQUEEZE_Y, text_substitution);
        }, _,
    )


    // Auto-Create button
    // Demo_clbk_animations_text_counter(ROOT_WIDGETS.CREATE_ROOT, null, true);

}
function Test_text_clbk_animations_counter_2_text_meshes(x, y, text_pad_x = 10, text_pad_y = 6, clbk_anim_flag = CLBK_ANIMATIONS.TEXT_TRANSLATE_Y, speed = 10, slope = .04) {

    const section  = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[10, 10], pos:[x, y, 0], col:GREY[1]}));
    Widget_gfx_ready_enable({mesh:section, enable_sdf_rect: 10, enable_col_per_vertex:COLOR_GRADIENT_HORIZONTAL(GREY[1], GREY[4])});
    section.align.flags = (ALIGN_2.VERTICAL|ALIGN_2.RESIZE_SELF);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);


    const mesh2 = Widget_ready_label(_, '_', _, _, _, 10, _, _, _, false);
    Widget_gfx_ready_enable({mesh:mesh2, enable_sdf_rect: 10, enable_col_per_vertex:COLOR_GRADIENT_HORIZONTAL(GREEN[2], GREEN[7])});
    mesh2.align.flags = ALIGN_2.HORIZONTAL
    section.AddItem(mesh2)
    
    const mesh1 = Widget_ready_label(_, '.', _, _, _, 10, _, _, _, false);
    Widget_gfx_ready_enable({mesh:mesh1, enable_sdf_rect: 10, enable_col_per_vertex:COLOR_GRADIENT_HORIZONTAL(YELLOWR[2], YELLOWR[7])});
    mesh1.align.flags = ALIGN_2.HORIZONTAL
    section.AddItem(mesh1)


    Align_pre_simple(section);

    section.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENT;
    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);

    section.Calc_no_gfx_
    section.Render()
    section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)
    Construct_listen_events_from_mesh_tree(section);
    Construct_listen_events_relations_from_mesh_tree(section);
    Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);




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


function CreateSimpleWidgetText() {

    const widget_text = Create_widget_text({
        is_root: ROOT_WIDGETS.CREATE_ROOT,
        pos: [0, 0, 0],
        col: ORANGER[9],
        texture_id: TEXTURES.CONSOLA_VARIANT_FONT,
        font_size: 10,
        text: `|Widget_Text inside a Section\n| This is a new line @#-$%`,
        is_debug_mesh: 0x0,
        variant_idx: ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S8_0,
        pad: [10, 6],
    });
    widget_text.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

    /********************************************************************************************************************************************************/
    // Render
    widget_text.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


    widget_text.Render();
    Root_group_activate_all_vbs_in_renderqueue(widget_text.root_bufferidx);
    widget_text.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, widget_text.gfx.vb.groupidx);
}
function CreateTextInSectionWithNewLine() { // GOOD!! render text from widget text directly to a section or stand alone. ABLE TO create layout with VERTICAL alignment via the new implementation
    // const section = Create_widget_section(Style_section_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, options:SECTION.VERTICAL, pos:[50, 250, 0], col:TRANSPARENCY(GREY[7], .5)}));
    const section = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, options:SECTION.VERTICAL, pos:[50, 250, 0], col:TRANSPARENCY(GREY[7], .5)}));
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 1);
    section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    section.align.flags = ALIGN_2.RESIZE_SELF;

    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


    const info1 = Create_widget_text({
        is_root: _,
        pos: [0, 0, 0],
        col: ORANGER[9],
        texture_id: TEXTURES.CONSOLA_VARIANT_FONT,
        font_size: 10,
        text: `|Widget_Text inside a Section\n| This is a new line @#-$%`,
        is_debug_mesh: 0x0,
        variant_idx: ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S8_0,
        // sub_texture_id, 
        pad: [10, 6],
    });
    info1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    section.AddItem(info1);
    info1.align.flags = ALIGN_2.HORIZONTAL

    const info2 = Create_widget_text({
        is_root: _,
        pos: [0, 0, 0],
        col: GREEN[9],
        texture_id: TEXTURES.CONSOLA_VARIANT_FONT,
        font_size: 10,
        text: `|This is a new widget_text,\naligned verticaly inside the section`,
        is_debug_mesh: 0x0,
        variant_idx: ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S5_0,
        // sub_texture_id, 
        pad: [10, 6],
    });
    info2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    section.AddItem(info2);
    info2.align.flags = ALIGN_2.VERTICAL


    /********************************************************************************************************************************************************/
    // Align
    const ret = Align_pre_simple(section);
    const pad_x = section.StylesGetPad(STYLES.AXIS.X);
    const pad_y = section.StylesGetPad(STYLES.AXIS.Y);
    section.geom.dim[0] = ret.dim_x + pad_x;
    section.geom.dim[1] = ret.dim_y + pad_y;
    // section.geom.pos[0] = pos[0];
    // section.geom.pos[1] = pos[1];
    // Align_expand(section, section.align.flags,)


    /********************************************************************************************************************************************************/
    // Render
    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


    section.Render();
    Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
    Construct_listen_events_from_mesh_tree(section)
    Construct_listen_events_relations_from_mesh_tree(section);
    section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);
}



function TexturedRect(is_root = 0x0, name = 'TexturedRect', x = 0, y = 0, dim = [32 / 2, 32 / 2], color = WHITE, pad = [0, 0], texture_id = TEXTURES.COIN) {

    // const section = Create_rect_mesh(Style_rect_default_properties({is_root:is_root, pad:pad, pos:[x, y, 0], dim:dim, col:color, texture_id:texture_id, sub_texture_id:sub_texture_id}));
    const section = Create_rect_mesh(Style_rect_default_properties({is_root:is_root, pad:pad, pos:[x, y, 0], dim:dim, col:color, texture_id:texture_id, }));
    // const section = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[0, 0], pos:[10, 20, 0], dim:[256 / 2, 256 / 2], text_col:WHITE, texture_id:TEXTURES.TEST_APPLE}));

    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    // section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.SetName(name);

    // section.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);
    // section.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3|SID.ATTR.R_CORNERS|SID.ATTR.FEATHER);
    // section.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3|SID.ATTR.DIM2|SID.ATTR.R_CORNERS|SID.ATTR.FEATHER);
    // section.sid.inst = (SID.ATTR.WPOS3|SID.ATTR.DIM2|SID.ATTR.R_CORNERS|SID.ATTR.FEATHER);

    if (is_root & ROOT_WIDGETS.CREATE_ROOT) {


        section.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
        section.GenGfxCtx();
        section.Render();

        Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
        Construct_listen_events_from_mesh_tree(section);
        Construct_listen_events_relations_from_mesh_tree(section);

        section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);
    }

    return section;
}
function Section(is_root = 0x0, name = 'Section ', x = 0, y = 0, dim = [20, 20], color = PURPLEB[6], pad = [10, 10], texture_file_id = INT_NULL) {

    // const section = Create_widget_section(is_root, _, pad, [x, y], dim, color, _, );
    const section = Create_widget_section(is_root, _, pad, [x, y, 0], dim, color, _, _, _, texture_file_id);
    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    // section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    // section.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, [YELLOW[9], REDL[9], GREENL[9], BLUEL[9]]);
    section.SetName(name);

    // section.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);
    // section.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3|SID.ATTR.R_CORNERS|SID.ATTR.FEATHER);
    // section.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3|SID.ATTR.DIM2|SID.ATTR.R_CORNERS|SID.ATTR.FEATHER);
    // section.sid.inst = (SID.ATTR.WPOS3|SID.ATTR.DIM2|SID.ATTR.R_CORNERS|SID.ATTR.FEATHER);

    if (is_root & ROOT_WIDGETS.CREATE_ROOT) {


        section.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
        section.GenGfxCtx();
        section.Render();

        Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
        Construct_listen_events_from_mesh_tree(section);
        Construct_listen_events_relations_from_mesh_tree(section);

        section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);
    }

    return section;
}
function Rotatable_section_with_rcorners_via_uniform_rotation(pos) {

    const marg = [10, 10];
    const dim = [70, 40];
    // pos[0] = 120;
    // pos[1] = 120;


    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, marg, pos, dim, BLUEL[5], _, [dim[0], 0, 15]);

    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.SetName(`section${grey_cnt++}`);

    // section.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);
    // section.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3|SID.ATTR.R_CORNERS|SID.ATTR.FEATHER);
    // section.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3|SID.ATTR.DIM2|SID.ATTR.R_CORNERS|SID.ATTR.FEATHER);

    // section.GfxUniformsEnable({ unif: SID.UNIF.FS_GENERIC_FLOAT, }, 'u_generic_float', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);

    {
        const s = Section(_, _, 0, 0, [20, 30], _, [30, 30]);
        s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        section.AddItem(s);
    }
    {
        const s = Section(_, _, 0, 0, [20, 30], _, [30, 30]);
        s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        section.AddItem(s);
    }


    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    section.GfxUniformsEnable({ unif: SID.UNIF.FS_GENERIC_FLOAT, }, 'u_generic_float', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);


    section.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
    section.GenGfxCtx();

    section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
    // section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
    section.Calc_no_gfx_update();

    section.Render();

    // section.RotateZ(.0);
    // section.RotateZ(.3);
    // section.GfxUniformSetAndUpdate('u_generic_float', .3, _);
    // // s.GfxUniformsEnable({ unif: SID.UNIF.FS_GENERIC_FLOAT, }, 'u_generic_float', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);
    // s.RotateZ(.3);
    // // s.GfxUniformSetAndUpdate('u_generic_float', .3, _);



    Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
    Construct_listen_events_from_mesh_tree(section);
    Construct_listen_events_relations_from_mesh_tree(section);

    section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);
    // section.GfxUniformSetAndUpdate('u_generic_float', Math.PI);

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
            // target_mesh.RotateZ(rot);

            for (let i = 0; i <= target_mesh.children.boundary; i++) {

                const child = target_mesh.children.buffer[i];
                // child.GfxUniformSetAndUpdate('u_generic_float', rot, _);
                child.RotateZ(rot);
            }

        }, params,
        );
    }

    return section;
}
function Rotatable_section_with_rcorners_via_attribute_rotation(pos) {

    const marg = [20, 20];
    const dim = [70, 40];
    // pos[0] = 120;
    // pos[1] = 120;


    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, marg, pos, dim, BLUEL[5], _, [dim[0], 0, 15]);

    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 10);
    // section.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, [YELLOW[9], REDL[9], GREENR[9], BLUEL[9]]);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_ANGLE);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.SetName(`section${grey_cnt++}`);

    // section.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);
    // section.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3|SID.ATTR.R_CORNERS|SID.ATTR.FEATHER);
    // section.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3|SID.ATTR.DIM2|SID.ATTR.R_CORNERS|SID.ATTR.FEATHER);

    // section.GfxUniformsEnable({ unif: SID.UNIF.FS_GENERIC_FLOAT, }, 'u_generic_float', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);

    {
        const s = Section(_, _, 0, 0, [50, 30], PURPLER[9], [50, 30],);
        s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 3);
        // s.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, [YELLOW[9], REDL[9], GREENR[9], BLUEL[9]]);
        s.EnableGfx(MESH_ENABLE.GFX.ATTR_ANGLE);
        section.AddItem(s);
    }
    {
        const s = Section(_, _, 0, 0, [50, 30], YELLOW[9], [50, 30],);
        s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 3);
        // s.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, [YELLOW[9], REDL[9], GREENR[9], BLUEL[9]]);
        s.EnableGfx(MESH_ENABLE.GFX.ATTR_ANGLE);
        section.AddItem(s);
    }


    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    // section.GfxUniformsEnable({ unif: SID.UNIF.FS_GENERIC_FLOAT, }, 'u_generic_float', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);


    section.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
    section.GenGfxCtx();

    section.options = SECTION.TOP_DOWN | SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
    // section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
    section.Calc_no_gfx_update();

    section.Render();

    // section.RotateZ(.0);
    // section.RotateZ(.3);
    // section.GfxUniformSetAndUpdate('u_generic_float', .3, _);
    // // s.GfxUniformsEnable({ unif: SID.UNIF.FS_GENERIC_FLOAT, }, 'u_generic_float', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);
    // s.RotateZ(.3);
    // // s.GfxUniformSetAndUpdate('u_generic_float', .3, _);



    Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
    Construct_listen_events_from_mesh_tree(section);
    Construct_listen_events_relations_from_mesh_tree(section);

    section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);
    // section.GfxUniformSetAndUpdate('u_generic_float', Math.PI);

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
                child.RotateZ(rot);
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

    // const grey = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, marg, pos, dim, TRANSPARENCY(BLUEL[5], tr), _, [, dim[1], 2]);
    // const grey = Create_widget_section(Style_section_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, options: _, pad: marg, pos: pos, dim: dim, col: TRANSPARENCY(BLUEL[5], tr), }));
    const grey = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, options: _, pad: marg, pos: pos, dim: dim, col: TRANSPARENCY(BLUEL[5], tr), }));
    grey.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    grey.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    grey.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    grey.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    grey.StateEnable(MESH_STATE.IS_RESIZEABLE);
    grey.SetName(`grey${grey_cnt++}`);


    grey.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


    grey.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    grey.Render();

    grey.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, grey.gfx.vb.groupidx)

    Root_group_activate_all_vbs_in_renderqueue(grey.root_bufferidx);
    Construct_listen_events_from_mesh_tree(grey);
    Construct_listen_events_relations_from_mesh_tree(grey);

    return grey;
}
function CreateSectionedWidgets(pos, name = 'NO NAME') {

    // const section = Create_widget_section(Style_section_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, options:SECTION.VERTICAL, pad:[40, 10], pos:pos, dim:[0, 0], col:GREY[1], name:name,}));
    const section = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, options:SECTION.VERTICAL, pad:[40, 10], pos:pos, dim:[0, 0], col:GREY[1], name:name,}));
    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS)
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.align.flags = ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF;
    // section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);


    // Add widgets
    {
        const btn = Create_widget_button(Style_button_default_properties({
            is_root: 0x0,
            pos: [0, 0, 1],
            col: GREENL[6],
            text_pad: [5, 4],
            text: 'Button',
            texture_id: TEXTURES.MTSDF_CONSOLAS_1024,
            font_size: 10,
            text_col: WHITE,
            is_debug_mesh: false,
            style: [10, 10, 0],
            is_debug_mesh: false,
        }));
        btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS)
        btn.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
        btn.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        btn.align.flags = ALIGN_2.VERTICAL;
        section.AddItem(btn);
    }
    {
        const btn = Create_widget_button(Style_button_default_properties({
            is_root: 0x0,
            pos: [0, 0, 1],
            col: ORANGE[8],
            text_pad: [5, 4],
            text: 'Button',
            texture_id: TEXTURES.MTSDF_CONSOLAS_1024,
            font_size: 10,
            text_col: WHITE,
            is_debug_mesh: false,
            style: [10, 10, 0],
            is_debug_mesh: false,
        }));
        btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS)
        btn.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
        btn.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        btn.align.flags = ALIGN_2.VERTICAL;
        section.AddItem(btn);
    }
    {
        const btn = Create_widget_button(Style_button_default_properties({
            is_root: 0x0,
            pos: [0, 0, 1],
            col: BLUEL[8],
            text_pad: [5, 4],
            text: 'Button',
            texture_id: TEXTURES.MTSDF_CONSOLAS_1024,
            font_size: 10,
            text_col: WHITE,
            is_debug_mesh: false,
            style: [10, 10, 0],
            is_debug_mesh: false,
        }));
        btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS)
        btn.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
        btn.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        btn.align.flags = ALIGN_2.VERTICAL;
        section.AddItem(btn);
    }


    Align_pre_simple(section);


    // Render
    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);

    // section.Calc_no_gfx_update(SECTION.RESIZE_PARENT | SECTION.VERTICAL);

    section.Render();


    Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

    section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)

    Construct_listen_events_from_mesh_tree(section)
    Construct_listen_events_relations_from_mesh_tree(section);

    return section;
}
function CreateLabel(is_root = ROOT_WIDGETS.CREATE_ROOT, name = 'Label', font, variant_idx, x = 0, y = 0, color = BLUEL[5], vb_groupidx = INT_NULL, text_vb_groupidx = INT_NULL, font_size = 20) {

    const label = Create_widget_label(Style_label_default_properties({
        is_root: is_root,
        pos: [x, y, 0],
        col: color,
        text_pad: [10, 6],
        text: name,
        // texture_id: TEXTURES.CONSOLA_VARIANT_FONT,
        // variant_idx: ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S2_0,
        texture_id: font,
        variant_idx: variant_idx,
        font_size: font_size,
        text_col: _,
        is_debug_mesh: false,
    }));

    label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 4);
    label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    label.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
    label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);



    // label.StateEnable(MESH_STATE.IS_HOVER_COLORABLE | MESH_STATE.IS_RESIZEABLE);
    // label.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);
    // label.text_mesh.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);


    if(is_root === ROOT_WIDGETS.CREATE_ROOT) {

        if (vb_groupidx !== INT_NULL) label.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, vb_groupidx, text_vb_groupidx);
        else label.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
        label.Render()
    
        label.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, label.gfx.vb.groupidx)
    
        if (is_root & ROOT_WIDGETS.CREATE_ROOT) Root_group_activate_all_vbs_in_renderqueue(label.root_bufferidx);
        Construct_listen_events_from_mesh_tree(label);
        Construct_listen_events_relations_from_mesh_tree(label);
        
        // label.text_mesh.SetColorRGB(REDL);
        // label.text_mesh.RenderTextFromString('REDL');
    
        // label.Align(ALIGN.BOTTOM | ALIGN.LEFT, [0, 0]);
        // label.Align(ALIGN.BOTTOM | ALIGN.RIGHT, [0, 0]);
        // label.Align(ALIGN.TOP | ALIGN.LEFT, [0, 0]);
        // label.Align(ALIGN.TOP | ALIGN.RIGHT, [0, 0]);
    }


    return label;
}



function CreateButton(x = 20, y = 400, is_root = ROOT_WIDGETS.CREATE_ROOT) {

    const btn = Create_widget_button(is_root, 'Button', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [x, y, 0], fontsize, GREY[1], WHITE, [5, 5], .5);
    btn.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    // btn.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
    btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

    // btn.Bind(()=>{console.log('HI')}, )

    if (is_root & ROOT_WIDGETS.CREATE_ROOT) {

        btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        btn.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
        btn.Render();
        Root_group_activate_all_vbs_in_renderqueue(btn.root_bufferidx);
        btn.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, btn.gfx.vb.groupidx)

        Construct_listen_events_from_mesh_tree(btn)
        Construct_listen_events_relations_from_mesh_tree(btn);
    }

    // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, btn, .001, 0.6, .6, 0)
    // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, btn, .002, 0.4, .8, .4)
    // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, btn, .003, 0.2, .8, .8)

    // // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, btn, .01, 0.6, 1.)
    // // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RGBA, btn, .01, 0.4, 1.)
    // // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RGB, btn, .01, 0.0, 1., 0)
    // // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.A, btn, .01, .0, 1., .0)

    // // btn.text_mesh.SetColorRGB(BLUE_10_120_220);

    // // btn.Align(ALIGN.LEFT | ALIGN.TOP, [0, 0]);
    // // btn.Align(ALIGN.RIGHT | ALIGN.BOTTOM, [15, 5]);

    return btn;
}



function CreateSwitchSimple(pos, is_root = ROOT_WIDGETS.CREATE_ROOT) {

    let ypos = 450

    // const switch1 = Create_widget_switch_simple(Style_switch_default_properties({is_root:is_root, pos:pos, size:34, col:_, handle_col:_, hover_margin: 8, pad:_}));
    const switch1 = Create_widget_switch_simple(Style_switch_default_properties({is_root:is_root, pos:pos, size:20, col:_, handle_col:_, hover_margin: 8, }));
    switch1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    // switch1.EnableGfxUniforms({ unif: SID.UNIF.FS_RCORNERS_VEC3, }, 'u_rcorners', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
    switch1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, switch1.geom.dim[1]);
    switch1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

    if (is_root & ROOT_WIDGETS.CREATE_ROOT) {

        switch1.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
        switch1.Render();
        Root_group_activate_all_vbs_in_renderqueue(switch1.root_bufferidx);

        switch1.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, switch1.gfx.vb.groupidx)

        Construct_listen_events_from_mesh_tree(switch1)
        Construct_listen_events_relations_from_mesh_tree(switch1);
    }

    return switch1;
}



function CreateSwitch() {

    let ypos = 500
    // const switch1 = Create_widget_switch_button(ROOT_WIDGETS.CREATE_ROOT, 'switch on', 'switch off', [100, ypos, 0], fontsize, GREY[1], WHITE, [5, 5], .5);
    const switch1 = Create_widget_switch_button(Style_switch_button_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, text_on:'switch on', text_off:'switch off', pos:[100, ypos, 0], font_size:fontsize, col:GREY[1], text_col:WHITE, text_pad:[5, 5],}));
    switch1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    switch1.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    switch1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, switch1.geom.dim[1]);
    switch1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    switch1.Bind(function () { console.log('CALLBACK FROM USER !!!!!!!!!!!!!!!!!!!!!!!!!!!') })
    switch1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

    switch1.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    switch1.Render();

    Root_group_activate_all_vbs_in_renderqueue(switch1.root_bufferidx);

    Construct_listen_events_from_mesh_tree(switch1)
    Construct_listen_events_relations_from_mesh_tree(switch1);
    switch1.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, switch1.gfx.vb.groupidx)
    // switch1.text_mesh.SetColorRGB(PURPLER[7], 4);
    Set_color_rgb(switch1, PURPLER[7]);
    // ypos += switch1.geom.dim[1] * 2 + 5;

    return switch1;
}



function CreateSliderSimple(is_root = ROOT_WIDGETS.CREATE_ROOT) {

    const pos = (is_root & ROOT_WIDGETS.CREATE_ROOT) ? [200, 500, 0] : [0, 0, 0]
    const slider = Create_widget_slider_simple(Style_slider_simple_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pos:[100, 100, 0], col:GREY[5], dim:[100, 4], pad:[10, 10], }));

    Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect:4, });
    slider.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);


    if (is_root & ROOT_WIDGETS.CREATE_ROOT) {

        slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
        slider.Render();
        Root_group_activate_all_vbs_in_renderqueue(slider.root_bufferidx);
        slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx)

        Construct_listen_events_from_mesh_tree(slider)
        Construct_listen_events_relations_from_mesh_tree(slider);
    }

    return slider;
}



function CreateSlider(is_root = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0, initial_val = .5, name = 'Slider Unamed') {

    const pos = (is_root & ROOT_WIDGETS.CREATE_ROOT) ? [x, y, 0] : [0, 0, 0]


    const slider = Create_widget_slider(Style_slider_default_properties({
        is_root:ROOT_WIDGETS.CREATE_ROOT, 
        pos:pos, 
        dim:[120, 15], 
        name:'98892839',
        col:GREY[5],
    }));
    // const slider = Create_widget_slider({
    //     is_root: ROOT_WIDGETS.CREATE_ROOT,
    //     pos: pos,
    //     dim: [120, 15],
    //     col: GREY[4],
    //     hover_margin: [10, 6],
    //     outer_pad: 4,
    //     name: name,
    //     // texture_id: TEXTURES.CONSOLA_VARIANT_FONT,
    //     texture_id: TEXTURES.MTSDF_CONSOLAS_1024,
    //     font_size: 0,
    //     // variant_idx: ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S2_0,

    //     bar: {
    //         // col:BLUEL[7],
    //         col: GREY[8],
    //     },
    //     handle: {
    //         // col:GREY[8],
    //         col: BLUEL[7],
    //     },
    // });

    slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10, 10);
    slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    slider.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

    slider.SetInitialValue(initial_val);


    if (is_root & ROOT_WIDGETS.CREATE_ROOT) {

        slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
        slider.Render();
        Root_group_activate_all_vbs_in_renderqueue(slider.root_bufferidx);
        slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx)

        Construct_listen_events_from_mesh_tree(slider)
        Construct_listen_events_relations_from_mesh_tree(slider);


        // Some Shader Effects
        // const handle = slider.GetHandle();
        // Gl_set_time(handle.gfx, 0.01); // Reset attribute time
        // handle.GfxUniformSetAndUpdate('u_generic_controls', [1., .0, .23, 0, .0, 0.]);


    }

    return slider

}




function SdfLine(col, pos, dim, render_instanced_flags = 0x0, enable_angle=false) {


    // const line = Create_widget_section(Style_section_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, options:SECTION.VERTICAL, pad:[0, 0], pos:pos, dim:dim, col:TRANSPARENCY(col, 1), name:'sdf linem2', style:[0, 10, 1.8]}));
    const line = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[0, 0], pos:pos, dim:dim, col:TRANSPARENCY(col, 1), name:'sdf linem2', style:[0, 10, 1.8]}));
    line.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    line.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dim[1]);
    line.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    // line.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
    // line.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
    if(enable_angle) line.EnableGfx(MESH_ENABLE.GFX.ATTR_ANGLE);

    line.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
    line.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)

    // line.sid.inst = (SID.ATTR.COL4 | SID.ATTR.WPOS3);
    line.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    line.Render();
    Root_group_activate_all_vbs_in_renderqueue(line.root_bufferidx);
    line.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, line.gfx.vb.groupidx)
    Construct_listen_events_from_mesh_tree(line)
    Construct_listen_events_relations_from_mesh_tree(line);

    return line;
}



function CreateDropdownTree(pos = [0, 0, 0], is_root = ROOT_WIDGETS.CREATE_ROOT) {

    const text_pad = [12, 4];
    const pad = [0, 0];
    const font_size = 8;
    const dp_rcorners = 7;
    const menu_rcorners = 7;
    const btn_rcorners = 7;

    const dp = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: is_root, text: `ROOT`, pos: pos, col: YELLOWL[3], menu_col: GREEN[4], text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
    dp.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
    dp.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    dp.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    dp.align.flags = ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF;


    Dropdown_roots_set_root(dp, dp);

    let zpos = 0;


    zpos++
    { // Many dps

        const sub_dp1_count = 2;
        const sub_dp2_count = 3;

        const col = GetSequencedColor()
        for (let i = 0; i < sub_dp1_count; i++) {

            const dpsub1 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}`, pos: [0, 0, zpos + 1], col: col, menu_col: GREY[1], text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
            dpsub1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
            dpsub1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            dp.AddToMenu(dpsub1);
            dpsub1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

            const col1 = TRANSPARENCY(PURPLEB[6], 1.);
            for (let j = 0; j < sub_dp2_count; j++) {

                const dpsub2 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}${j}`, pos: [0, 0, zpos + 2], col: col1, menu_col: TRANSPARENCY(GREY[1], 1.), text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
                dpsub1.AddToMenu(dpsub2);
                dpsub2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
                dpsub2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                dpsub2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                dpsub2.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

                const col2 = TRANSPARENCY(GREEN[6], 1.)

                for (let k = 0; k < sub_dp2_count; k++) {

                    const dpsub3 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${j}${k}`, pos: [0, 0, zpos + 3], col: col2, menu_col: TRANSPARENCY(GREY[1], 1.), text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
                    dpsub2.AddToMenu(dpsub3);
                    dpsub3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
                    dpsub3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                    dpsub3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                    dpsub3.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

                    const col3 = TRANSPARENCY(YELLOW[6], 1.)
                    for (let n = 0; n < sub_dp2_count; n++) {

                        const dpsub4 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${k}${n}`, pos: [0, 0, zpos + 4], col: col3, menu_col: TRANSPARENCY(GREY[1], 1.), text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
                        dpsub3.AddToMenu(dpsub4);
                        dpsub4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
                        dpsub4.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                        dpsub4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                        dpsub4.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

                        
                        const col4 = TRANSPARENCY(PURPLEB[6], 1.)
                        for (let m = 0; m < 10; m++) {

                            const dpsub5 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${k}${n}${m}`, pos: [0, 0, zpos + 4], col: col4, menu_col: TRANSPARENCY(GREY[3], 1.), text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
                            dpsub4.AddToMenu(dpsub5);
                            dpsub5.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
                            dpsub5.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                            dpsub5.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                            dpsub5.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

                        }

                    }

                }
            }

        }
    }


    if (is_root & ROOT_WIDGETS.CREATE_ROOT) {

        Align_pre_simple(dp)

        dp.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        dp.Render()
        Root_group_activate_all_vbs_in_renderqueue(dp.root_bufferidx);

        dp.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, dp.gfx.vb.groupidx)

        Construct_listen_events_from_mesh_tree(dp)
        Construct_listen_events_relations_from_mesh_tree(dp);

        // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
        View_build_group_from_root_mesh(dp);
    }

    return dp;
}

function CreateDropdownTreeHorizontalLayout(pos = [0, 0, 0], is_root = ROOT_WIDGETS.CREATE_ROOT) {

    const text_pad = [12, 4];
    const pad = [0, 0];
    const font_size = 8;
    const dp_rcorners = 7;
    const menu_rcorners = 7;
    const btn_rcorners = 7;

    const dp = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: is_root, text: `ROOT`, pos: pos, col: YELLOWL[3], menu_col: GREEN[4], text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
    dp.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
    dp.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    dp.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    dp.align.flags = ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF;


    Dropdown_roots_set_root(dp, dp);

    let zpos = 0;


    zpos++
    { // Many dps

        const sub_dp1_count = 2;
        const sub_dp2_count = 2;

        const col = GetSequencedColor()
        for (let i = 0; i < sub_dp1_count; i++) {

            const dpsub1 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}`, pos: [0, 0, zpos + 1], col: col, menu_col: GREY[1], text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
            dpsub1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
            dpsub1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            dpsub1.align.flags = ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF;
            dpsub1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            dp.AddToMenu(dpsub1);

            {
                const l = Widget_ready_label();
                Widget_gfx_ready_enable({mesh:l, font_size:10});
                l.SetLayout(ALIGN_2.VERTICAL)
                dpsub1.AddToMenu(l);
            }
            {
                const l = Create_widget_label(Style_label_default_properties({text:'Hi There!', font_size:10}));
                Widget_gfx_ready_enable({mesh:l, enable_sdf_rect:6});
                l.SetLayout(ALIGN_2.VERTICAL)
                dpsub1.AddToMenu(l);
            }
            {
                const slider = Widget_ready_slider();
                Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect:6});
                slider.SetLayout(ALIGN_2.HORIZONTAL)
                dpsub1.AddToMenu(slider);
            }
            {
                const dpsub2 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `DP1`, pos: [0, 0, zpos + 1], col: col, menu_col: GREY[1], text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
                dpsub2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
                dpsub2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                dpsub2.align.flags = ALIGN_2.VERTICAL|ALIGN_2.RESIZE_SELF;
                dpsub2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                dpsub1.AddToMenu(dpsub2);
                {
                    const l = Create_widget_label(Style_label_default_properties({text:'Inner Label!', font_size:10}));
                    Widget_gfx_ready_enable({mesh:l, enable_sdf_rect:6});
                    l.SetLayout(ALIGN_2.VERTICAL)
                    dpsub2.AddToMenu(l);

                    {
                        const slider = Widget_ready_slider();
                        Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect:6});
                        slider.SetLayout(ALIGN_2.HORIZONTAL)
                        dpsub2.AddToMenu(slider);
                    }
                }
                {
                    const l = Create_widget_label(Style_label_default_properties({text:'Inner Label!', font_size:10}));
                    Widget_gfx_ready_enable({mesh:l, enable_sdf_rect:6});
                    l.SetLayout(ALIGN_2.VERTICAL)
                    dpsub2.AddToMenu(l);
                }
    
            }
            {
                const dpsub2 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `DP 2`, pos: [0, 0, zpos + 1], col: col, menu_col: GREY[1], text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
                dpsub2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
                dpsub2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                dpsub2.align.flags = ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF;
                dpsub2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                dpsub1.AddToMenu(dpsub2);
                {
                    const l = Create_widget_label(Style_label_default_properties({text:'Inner Label!', font_size:10}));
                    Widget_gfx_ready_enable({mesh:l, enable_sdf_rect:6});
                    l.SetLayout(ALIGN_2.VERTICAL)
                    dpsub2.AddToMenu(l);
                }
                {
                    const l = Create_widget_label(Style_label_default_properties({text:'Inner Label!', font_size:10}));
                    Widget_gfx_ready_enable({mesh:l, enable_sdf_rect:6});
                    l.SetLayout(ALIGN_2.VERTICAL)
                    dpsub2.AddToMenu(l);
                }
    
            }



        }
    }


    if (is_root & ROOT_WIDGETS.CREATE_ROOT) {

        Align_pre_simple(dp)

        dp.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        dp.Render()
        Root_group_activate_all_vbs_in_renderqueue(dp.root_bufferidx);

        dp.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, dp.gfx.vb.groupidx)

        Construct_listen_events_from_mesh_tree(dp)
        Construct_listen_events_relations_from_mesh_tree(dp);

        // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
        View_build_group_from_root_mesh(dp);
    }

    return dp;
}


function TestAlignNew(pos = [0, 0, 0]) {

    const widgets_construct = ()=>{

        const s = Widget_ready_rect();
        s.align.flags = ALIGN_2.RESIZE_SELF|ALIGN_2.HORIZONTAL

        {
            { const l = CreateLabel(0x0, 'Hi',        TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 700, GREY[4], _, _, 12); s.AddItem(l); l.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); l.align.flags = ALIGN_2.HORIZONTAL; }
            { const l = CreateLabel(0x0, 'This is',   TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 700, GREY[4], _, _, 12); s.AddItem(l); l.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); l.align.flags = ALIGN_2.HORIZONTAL; }
            { const l = CreateLabel(0x0, 'a sample',  TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 700, GREY[4], _, _, 12); s.AddItem(l); l.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); l.align.flags = ALIGN_2.VERTICAL; }
            { const l = CreateLabel(0x0, 'of labels', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 700, GREY[4], _, _, 12); s.AddItem(l); l.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); l.align.flags = ALIGN_2.VERTICAL; }
        }
        /** Test: Many section */
        {
            const sections = CreateManySectionsMinimal(0x0);
            sections.align.flags = ALIGN_2.RESIZE_SELF|ALIGN_2.HORIZONTAL;
            s.AddItem(sections);
        }
        /** Test: Sliders */
        {
            const slider = Widget_ready_slider(_, _,);
            slider.align.flags = ALIGN_2.VERTICAL;
            s.AddItem(slider);
        }
        /** Test: Switches */
        { 
            
            // {const switch1 = Widget_ready_switch(); switch1.align.flags=ALIGN_2.HORIZONTAL; s.AddItem(switch1);}
            {const switch1 = Widget_ready_switch(); switch1.align.flags=ALIGN_2.VERTICAL; s.AddItem(switch1);}
            {const switch1 = Widget_ready_switch(); switch1.align.flags=ALIGN_2.VERTICAL; s.AddItem(switch1);}
            {const switch1 = Widget_ready_switch(); switch1.SetLayout(ALIGN_2.VERTICAL); s.AddItem(switch1);}
        }
        /** Test: Scroller */
        // { 
        //     const scroller = CreateScrollerClampAlphaTest(0x0, );
        //     scroller.align.flags=ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF;
        //     s.AddItem(scroller);
        // }
        // { 
        //     const scroller = CreateScrollerClampAlphaTest(0x0, );
        //     scroller.align.flags=ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF;
        //     s.AddItem(scroller);
        // }
        // { 
        //     const scroller = CreateScrollerClampAlphaTest(0x0, );
        //     scroller.align.flags=ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF;
        //     s.AddItem(scroller);
        // }

        return s;
    }

    const text_pad = [12, 4];
    const pad = [0, 0];
    const font_size = 8;
    const dp_rcorners = 7;
    const menu_rcorners = 7;
    const btn_rcorners = 7;

    
    const dp = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, text: `ROOT`, pos: pos, col: YELLOWL[3], menu_col: GREEN[4], text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size  }));
    dp.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
    dp.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    dp.align.flags = ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF;
    dp.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    dp.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    
    Dropdown_roots_set_root(dp, dp);
    
    
    
    const sub_dp1_count = 2;
    const sub_dp2_count = 2;
    let zpos = 1


    let col = GetSequencedColor()
    for (let i = 0; i < sub_dp1_count; i++) {

        const dpsub1 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}`, pos: [0, 0, zpos++], col: col, menu_col: GREY[1], text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
        dpsub1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
        dpsub1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        dpsub1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        dp.AddToMenu(dpsub1);

        { // Test: Labels
            const l = Widget_ready_label(_, 'HI!',);
            dpsub1.AddToMenu(l);
            l.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        }


        col = GetSequencedColor(6)
        for (let j = 0; j < sub_dp2_count; j++) {

            const dpsub2 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}${j}`, pos: [0, 0, zpos++], col: col, menu_col: GREY[1], text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
            dpsub2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
            dpsub2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            dpsub2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            dpsub1.AddToMenu(dpsub2);


            const col2 = GetSequencedColor(6)
            for (let k = 0; k < sub_dp2_count; k++) {

                const dpsub3 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}${j}${k}`, pos: [0, 0, zpos++], col: col2, menu_col: GREY[1], text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
                dpsub3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
                dpsub3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                dpsub3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                dpsub3.align.flags = ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF
                dpsub2.AddToMenu(dpsub3);

                
                const w2 = widgets_construct();
                dpsub3.AddToMenu(w2);

                const col3 = GetSequencedColor(6)
                for (let n = 0; n < sub_dp2_count; n++) {
                    const dpsub4 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}${j}${k}${n}`, pos: [0, 0, zpos++], col: col3, menu_col: GREY[1], text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
                    dpsub4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
                    dpsub4.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                    dpsub4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                    dpsub3.AddToMenu(dpsub4);

                    const s = Widget_ready_label(_,'sk1');
                    dpsub4.AddToMenu(s)

                    
                    const w2 = widgets_construct();
                    dpsub4.AddToMenu(w2);

                }

            }
        }

    }


    /** Mny Labels */
    {
        { const l = CreateLabel(0x0, 'Hi',        TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 700, GREY[4], _, _, 12); dp.AddToMenu(l); l.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); l.align.flags = ALIGN_2.HORIZONTAL; }
        { const l = CreateLabel(0x0, 'This is',   TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 700, GREY[4], _, _, 12); dp.AddToMenu(l); l.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); l.align.flags = ALIGN_2.HORIZONTAL; }
        { const l = CreateLabel(0x0, 'a sample',  TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 700, GREY[4], _, _, 12); dp.AddToMenu(l); l.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); l.align.flags = ALIGN_2.VERTICAL; }
        { const l = CreateLabel(0x0, 'of labels', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 700, GREY[4], _, _, 12); dp.AddToMenu(l); l.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); l.align.flags = ALIGN_2.VERTICAL; }
    }
    /** Test: Many section */
    {
        const sections = CreateManySectionsMinimal(0x0);
        sections.align.flags = ALIGN_2.RESIZE_SELF|ALIGN_2.HORIZONTAL;
        dp.AddToMenu(sections);
    }
    {
        const sections = CreateManySectionsMinimal(0x0);
        sections.align.flags = ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL;
        dp.AddToMenu(sections);
    }
    /** Test: Sliders */
    {
        const slider = Widget_ready_slider(_, _,);
        slider.align.flags = ALIGN_2.VERTICAL;
        dp.AddToMenu(slider);
    }
    /** Test: Switches */
    { 
        
        // {const switch1 = Widget_ready_switch(); switch1.align.flags=ALIGN_2.HORIZONTAL; dp.AddToMenu(switch1);}
        {const switch1 = Widget_ready_switch(); switch1.align.flags=ALIGN_2.VERTICAL; dp.AddToMenu(switch1);}
        {const switch1 = Widget_ready_switch(); switch1.align.flags=ALIGN_2.VERTICAL; dp.AddToMenu(switch1);}
        {const switch1 = Widget_ready_switch(); switch1.SetLayout(ALIGN_2.VERTICAL); dp.AddToMenu(switch1);}
    }
    /** Test: Scroller */
    { 
        const scroller = CreateScrollerClampAlphaTest(0x0, );
        scroller.align.flags=ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF;
        dp.AddToMenu(scroller);
    }
    { 
        const scroller = CreateScrollerClampAlphaTest(0x0, );
        scroller.align.flags=ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF;
        dp.AddToMenu(scroller);
    }
    { 
        const scroller = CreateScrollerClampAlphaTest(0x0, );
        scroller.align.flags=ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF;
        dp.AddToMenu(scroller);
    }


    Align_pre_simple(dp)

    dp.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

    dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

    dp.Render()
    Root_group_activate_all_vbs_in_renderqueue(dp.root_bufferidx);

    dp.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, dp.gfx.vb.groupidx)

    Construct_listen_events_from_mesh_tree(dp)
    Construct_listen_events_relations_from_mesh_tree(dp);

    // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
    View_build_group_from_root_mesh(dp);

    return dp;
}




function TEST_LISTENERS_CreateDropdown(pos = [0, 0, 0], is_root = ROOT_WIDGETS.CREATE_ROOT) {

    // const pad = [10, 2.5]
    const pad = [10, 4]
    const margin = [5, 5]


    const section = Create_rect_mesh(Style_rect_default_properties({is_root:is_root, pad:[20, 20], dim:[200, 400], col:GREY[1]}));
    // section.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
    Widget_gfx_ready_enable({mesh:section, enable_sdf_rect:10})


    const dp = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: is_root, text: `ROOT`, pos: pos, col: YELLOWL[3], menu_col: GREEN[4], text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
    dp.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
    dp.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    dp.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    dp.align.flags = ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF;

    section.AddItem(dp)

    // const dp = Create_widget_dropdown(_, `dp${0}`, [0,0,0], YELLOWL[3], GREEN[4], WHITE, pad, _, _, _, margin);
    // section.AddItem(dp);
    // dp.SetName(`dp${0}`)
    // Dropdown_roots_set_root(dp, dp);

    // {
    //     for(let j=0; j<2; j++){
    //         const label = Create_widget_label(_, `label${j}`);
    //         dp.AddToMenu(label);
    //         label.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
    //     }
    // }


    // for (let i = 0; i < 2; i++) {
    //     // const dp = Create_widget_dropdown(is_root, `ROOT`, pos, YELLOWL[3], GREEN[4], WHITE, pad, _, _, _, margin);
    //     const dp = Create_widget_dropdown(_, `dp${i}`, [0, 0, 0], YELLOWL[3], GREEN[4], WHITE, pad, _, _, _, margin);
    //     section.AddItem(dp);
    //     dp.SetName(`dp${i}`)

    //     {
    //         const dp1 = Create_widget_dropdown(_, `dp child`, [0, 0, 0], YELLOWL[3], GREEN[4], WHITE, pad, _, _, _, margin);
    //         dp.AddToMenu(dp1);
    //         dp1.SetName(`dp child`)

    //         for (let j = 0; j < 2; j++) {
    //             const label = Create_widget_label(_, `label${j}`);
    //             dp1.AddToMenu(label);
    //             label.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
    //         }
    //     }
    //     {
    //         const dp1 = Create_widget_dropdown(_, `dp child`, [0, 0, 0], YELLOWL[3], GREEN[4], WHITE, pad, _, _, _, margin);
    //         dp.AddToMenu(dp1);
    //         dp1.SetName(`dp child`)

    //         for (let j = 0; j < 2; j++) {
    //             const label = Create_widget_label(_, `label${j}`);
    //             dp1.AddToMenu(label);
    //             label.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
    //         }
    //     }

    //     Dropdown_roots_set_root(dp, dp);
    // }



    if (is_root & ROOT_WIDGETS.CREATE_ROOT) {

        section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
        // section.options = SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
        // section.options = SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.FIXED_H;
        // section.Calc_no_gfx_update();
        section.Render();
        Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
        section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)
        Construct_listen_events_from_mesh_tree(section);
        Construct_listen_events_relations_from_mesh_tree(section);
        View_build_group_from_root_mesh(section);
        // View_build_group_from_root_mesh(dp);
    }


}




function Render_font_symbols_atlas_texture(x, y) {

    const section = Create_widget_section(Style_section_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[0, 0], pos:[0, 0, 0], dim:[100, 100], col:TRANSPARENCY(GREY[1], .8), name:'Test symbols font rendering'}));
    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

    section.StylesSetPad([10, 10]);
    section.align.flags = ALIGN_2.RESIZE_SELF;

    let size = 40;
    // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.original); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.original); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.close_1); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_left); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_up); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_right); s.align.flags = ALIGN_2.VERTICAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_down); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_lr); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_ud); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_lu); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_ru); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_clockwise_2); s.align.flags = ALIGN_2.VERTICAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_clockwise); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_anti_clockwise); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_thick_left); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_thick_up); s.align.flags = ALIGN_2.VERTICAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_thick_right); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_thick_down); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.circle_1); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.circle_2); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.circle_3); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.circle_4); s.align.flags = ALIGN_2.VERTICAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.tie); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.under_tie); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.close_boxed); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.diagonal_r); s.align.flags = ALIGN_2.VERTICAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.diagonal_l); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.close_2); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._8); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._9); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._10); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._11); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._12); s.align.flags = ALIGN_2.VERTICAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._13); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._14); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._15); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._16); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._17); s.align.flags = ALIGN_2.VERTICAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._18); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._19); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._20); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._21); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._22); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._23); s.align.flags = ALIGN_2.VERTICAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._24); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._25); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._26); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._27); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._28); s.align.flags = ALIGN_2.VERTICAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._29); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._30); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._31); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._32); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._33); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._34); s.align.flags = ALIGN_2.VERTICAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._35); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._36); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._37); s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s); }

    { /// SAVE
        // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.original);            s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s);}
        // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.close_1);             s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s);}
        // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_left);          s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s);}
        // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_up);            s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s);}
        // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_right);         s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s);}
        // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_down);          s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s);}
        // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_lr);            s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s);}
        // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_ud);            s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s);}
        // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_lu);            s.align.flags = ALIGN_2.VERTICAL; section.AddItem(s);}
        // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_ru);            s.align.flags = ALIGN_2.HORIZONTAL; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_clockwise_2);    y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_clockwise);      y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_anti_clockwise); y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_thick_left);     y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_thick_up);       y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_thick_right);    y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.arrow_thick_down);     y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.circle_1);             y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.circle_2);             y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.circle_3);             y = 0;  x += 150;      s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.circle_4);             y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.tie);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.under_tie);            y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.close_boxed);          y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.diagonal_r);           y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.diagonal_l);           y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.close_2);             y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._8);                   y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._9);                   y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._10);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._11);                  y = 0;  x += 150;      s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._12);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._13);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._14);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._15);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._16);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._17);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._18);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._19);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._20);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._21);                  y = 0;  x += 150;      s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._22);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._23);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._24);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._25);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._26);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._27);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._28);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._29);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._30);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._31);                  y = 0;  x += 150;      s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._32);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._33);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._34);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._35);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._36);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._37);                  y += s.geom.dim[1]*2;  s.align.flags = ALIGN_2.VERTICAL|ALIGN_2.PRESERVE_SELF_POS|ALIGN_2.RESIZE_SELF; section.AddItem(s);}
    }




    /********************************************************************************************************************************************************/
    // Align
    const ret = Align_pre_simple(section);
    const pad_x = section.StylesGetPad(STYLES.AXIS.X);
    const pad_y = section.StylesGetPad(STYLES.AXIS.Y);
    section.geom.dim[0] = ret.dim_x + pad_x;
    section.geom.dim[1] = ret.dim_y + pad_y;

    // Calculate from pos=[0,0], and then add the user's pos
    section.geom.pos[0] = 30;
    section.geom.pos[1] = 50;

    /********************************************************************************************************************************************************/
    // Render
    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
    section.Render();
    Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
    Construct_listen_events_from_mesh_tree(section)
    Construct_listen_events_relations_from_mesh_tree(section);
    section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);
}




function CreateDropdown3(pos, dim) {

    const pad = [4, 2]
    const margin = [8, 8]
    const dp = Create_widget_dropdown(ROOT_WIDGETS.CREATE_ROOT, `0`, pos, GREY[2], BLUE_10_120_220, WHITE, pad, _, _, _, _, margin);
    // dp.CreateMoveEvent();
    dp.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    dp.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    dp.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    dp.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    // dp.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);


    const sub_dp1_count = 2;
    const sub_dp2_count = 5;

    const col = GetSequencedColor()
    for (let i = 0; i < sub_dp1_count; i++) {

        const dpsub1 = Create_widget_dropdown(_, `0${i}`, [0, 0, 0], GREY[1], col, WHITE, pad, _, _, _, _, margin);
        dpsub1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
        dpsub1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        dp.AddToMenu(dpsub1);
        dpsub1.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);


        for (let j = 0; j < sub_dp2_count; j++) {
            const s = Create_widget_section(_, SECTION.VERTICAL, [5, 5], pos, [20, 10], TRANSPARENCY(GREEN[7], 1.5), `0${i}${j}`)
            s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
            s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 5);
            s.options = SECTION.EXPAND | SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
            dpsub1.AddToMenu(s);
        }
        // for (let j = 0; j < sub_dp2_count; j++) {
        //     const s = Create_widget_section(_, SECTION.VERTICAL, [5, 5], pos, [20, 10], TRANSPARENCY(GREEN[7], 1.5), `0${i}${j}`)
        //     dpsub1.AddToMenu(s);
        // }
    }

    dp.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
    dp.options = SECTION.EXPAND | SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
    dp.Calc_no_gfx_update();
    dp.Render();
    Root_group_activate_all_vbs_in_renderqueue(dp.root_bufferidx);
    dp.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, dp.gfx.vb.groupidx)
    Construct_listen_events_from_mesh_tree(dp)
    Construct_listen_events_relations_from_mesh_tree(dp);

    // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
    View_build_group_from_root_mesh(dp)

}




function CreateDropdown2InSection(pos, id) {

    const pad = [2, 1]
    const margin = [7, 7]


    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [5, 5], pos, [20, 10], TRANSPARENCY(GREEN[2], 1.5), 'S')
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

    const dp = Create_widget_dropdown(_, `0`, [0, 0, pos[2]], GREY[2], BLUE_10_120_220, WHITE, pad, _, _, _, _, margin);
    dp.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
    dp.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    Dropdown_roots_set_root(dp, dp);

    section.AddItem(dp)


    const sub_dp1_count = 3;
    const sub_dp2_count = 1;

    const col = GetSequencedColor()
    for (let i = 0; i < sub_dp1_count; i++) {


        const label = Create_widget_label(_, `sssdsdsdsdsLabel ${id++}`, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, pos[2]], fontsize, GREY[1], WHITE, [14, 4], .5,);
        label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
        label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        label.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        dp.AddToMenu(label);

        const col1 = GetSequencedColor()
        const dpsub2 = Create_widget_dropdown(_, `${i}0`, [0, 0, 0], GREY[1], col1, WHITE, pad, _, _, _, _, margin);
        dpsub2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        dp.AddToMenu(dpsub2);

        // const col2 = GetSequencedColor()
        // {
        //     const dpsub3 = Create_widget_dropdown(_, `${i}00`, [0, 0, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //     dpsub2.AddToMenu(dpsub3);
        //     {
        //         const dpsub5 = Create_widget_dropdown(_, `${i}000`, [0, 0, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //         dpsub3.AddToMenu(dpsub5);
        //         {
        //             const dpsub4 = Create_widget_dropdown(_, `${i}0000`, [0, 0, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //             dpsub5.AddToMenu(dpsub4);
        //         }
        //         {
        //             const dpsub4 = Create_widget_dropdown(_, `${i}0001`, [0, 0, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //             dpsub5.AddToMenu(dpsub4);
        //         }
        //     }
        //     {
        //         const dpsub5 = Create_widget_dropdown(_, `${i}001`, [0, 0, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //         dpsub3.AddToMenu(dpsub5);
        //         {
        //             const dpsub4 = Create_widget_dropdown(_, `${i}0010`, [0, 0, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //             dpsub5.AddToMenu(dpsub4);
        //         }
        //         {
        //             const dpsub4 = Create_widget_dropdown(_, `${i}0011`, [0, 0, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //             dpsub5.AddToMenu(dpsub4);
        //         }
        //     }
        // }
        // {
        //     const dpsub3 = Create_widget_dropdown(_, `${i}01`, [0, 0, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //     dpsub2.AddToMenu(dpsub3);
        //     {
        //         const dpsub5 = Create_widget_dropdown(_, `${i}010`, [0, 0, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //         dpsub3.AddToMenu(dpsub5);
        //         {
        //             const dpsub4 = Create_widget_dropdown(_, `${i}0100`, [0, 0, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //             dpsub5.AddToMenu(dpsub4);
        //         }
        //         {
        //             const dpsub4 = Create_widget_dropdown(_, `${i}0101`, [0, 0, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //             dpsub5.AddToMenu(dpsub4);
        //         }
        //     }
        //     {
        //         const dpsub5 = Create_widget_dropdown(_, `${i}011`, [0, 0, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //         dpsub3.AddToMenu(dpsub5);
        //         {
        //             const dpsub4 = Create_widget_dropdown(_, `${i}0110`, [0, 0, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //             dpsub5.AddToMenu(dpsub4);
        //         }
        //         {
        //             const dpsub4 = Create_widget_dropdown(_, `${i}0111`, [0, 0, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //             dpsub5.AddToMenu(dpsub4);
        //         }
        //     }
        // }

    }

    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

    section.options = SECTION.EXPAND | SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
    section.Calc_no_gfx_update();


    section.Render();
    Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
    section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)

    Construct_listen_events_from_mesh_tree(section)
    Construct_listen_events_relations_from_mesh_tree(section);

    View_build_group_from_root_mesh(section)

    // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes

    return dp;

}





function CreateManySectionsMinimal(is_root = ROOT_WIDGETS.CREATE_ROOT) {

    const tr = .7;

    const blu = Widget_ready_rect(_, is_root, 365, 400, [100, 100], TRANSPARENCY(BLUEL[7], tr), [15, 15],);
    blu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    blu.SetLayout(ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF);
    
    
    const red = Widget_ready_rect(_, _, _, _, _, TRANSPARENCY(REDL[7], tr));
    red.SetLayout(ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF);
    red.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    blu.AddItem(red);


    {
        const black1 = Widget_ready_rect(_, _, _, _, _, TRANSPARENCY(GREY[1], tr),);
        black1.SetLayout(ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF);
        black1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        red.AddItem(black1);
        
        const grey11 = Widget_ready_rect(_, _, _, _, _, TRANSPARENCY(GREY[4], tr),);
        grey11.SetLayout(ALIGN_2.VERTICAL|ALIGN_2.RESIZE_SELF);
        grey11.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        black1.AddItem(grey11);
        
        const red111 = Widget_ready_rect(_, _, _, _, _, TRANSPARENCY(REDL[7], tr),);
        red111.SetLayout(ALIGN_2.VERTICAL|ALIGN_2.RESIZE_SELF);
        red111.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        grey11.AddItem(red111);
    
        const yel_1 = Widget_ready_rect(_, _, _, _, _, TRANSPARENCY(YELLOWR[7], tr),);
        yel_1.SetLayout(ALIGN_2.VERTICAL|ALIGN_2.RESIZE_SELF);
        yel_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        grey11.AddItem(yel_1);
        
        const purp12 = Widget_ready_rect(_, _, _, _, _, TRANSPARENCY(PURPLE[7], tr),);
        purp12.SetLayout(ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF);
        purp12.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        black1.AddItem(purp12);
        
        const blue13 = Widget_ready_rect(_, _, _, _, _, TRANSPARENCY(BLUEL[5], tr),);
        blue13.SetLayout(ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF);
        blue13.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        black1.AddItem(blue13);
        
        const green14 = Widget_ready_rect(_, _, _, _, _, TRANSPARENCY(GREEN[5], tr),);
        green14.SetLayout(ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF);
        green14.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        black1.AddItem(green14);
    }




    if (is_root & ROOT_WIDGETS.CREATE_ROOT) {

        Align_pre_simple(blu);
        blu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        blu.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
        blu.Render();
        Root_group_activate_all_vbs_in_renderqueue(blu.root_bufferidx);
        blu.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, blu.gfx.vb.groupidx);
        Construct_listen_events_from_mesh_tree(blu)
        Construct_listen_events_relations_from_mesh_tree(blu);
    }




    return blu;
}



function CreateManySections(scene) {

    const tr = .4;
    const rcorners1 = 10;
    const rcorners2 = 10;

    const blu = Create_rect_mesh(Style_rect_default_properties({is_root: ROOT_WIDGETS.CREATE_ROOT, options:SECTION.VERTICAL, pad:[15, 15], pos:[0, 400, 0], dim:[100, 100], col:TRANSPARENCY(BLUEL[7], tr)}));
    blu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    blu.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners1);
    blu.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    blu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE); blu.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    blu.StylesSetPad([15,15]);
    blu.align.flags = ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF
    

    // blu.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3)

    const red = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[15, 15], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(REDL[7], tr)}));
    red.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    red.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners1);
    red.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    red.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    red.align.flags = ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF
    blu.AddItem(red);
    
    
    const black1 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.HORIZONTAL, pad:[15, 15], pos:[0, 0, 1], dim:[20, 20], col:TRANSPARENCY(BLACK, tr)}));
    black1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    black1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners1); black1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    black1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    black1.align.flags = ALIGN_2.VERTICAL|ALIGN_2.RESIZE_SELF
    red.AddItem(black1);
    
    
    const black2 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.HORIZONTAL, pad:[15, 15], pos:[0, 0, 1], dim:[20, 20], col:TRANSPARENCY(BLACK, tr)}));
    black2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    black2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    black2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners1); black2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    black2.align.flags = ALIGN_2.VERTICAL|ALIGN_2.RESIZE_SELF
    red.AddItem(black2);
    
    const black3 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.HORIZONTAL, pad:[15, 15], pos:[0, 0, 1], dim:[20, 20], col:TRANSPARENCY(BLACK, tr)}));
    black3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    black3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    black3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners1); black3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    black3.align.flags = ALIGN_2.VERTICAL|ALIGN_2.RESIZE_SELF
    red.AddItem(black3);
    
    
    const black4 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.HORIZONTAL, pad:[15, 15], pos:[0, 0, 1], dim:[20, 20], col:TRANSPARENCY(GREY[1], tr)}));
    black4.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    black4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    black4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners1); black4.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    black4.align.flags = ALIGN_2.VERTICAL|ALIGN_2.RESIZE_SELF
    red.AddItem(black4);
    
    // {
        const grey11 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 2], dim:[20, 20], col:TRANSPARENCY(GREY[4], tr)}));
        grey11.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        grey11.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        grey11.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); grey11.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        grey11.align.flags = ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF
        black1.AddItem(grey11);
        const red111 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[0,0], pos:[0, 0, 2], dim:[20, 20], col:TRANSPARENCY(REDL[7], tr)}));
        red111.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        red111.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        red111.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); red111.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        red111.align.flags = ALIGN_2.HORIZONTAL
        grey11.AddItem(red111);
        const yel_1 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[0,0], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(YELLOWR[7], tr)}));
        yel_1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        yel_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        yel_1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); yel_1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        yel_1.align.flags = ALIGN_2.HORIZONTAL
        grey11.AddItem(yel_1);
        const purp12 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[0,0], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(PURPLE[7], tr)}));
        purp12.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        purp12.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        purp12.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); purp12.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        purp12.align.flags = ALIGN_2.VERTICAL
        black1.AddItem(purp12);
        const blue13 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[0,0], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(BLUEL[5], tr)}));
        blue13.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        blue13.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        blue13.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); blue13.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        blue13.align.flags = ALIGN_2.HORIZONTAL
        black1.AddItem(blue13);
        const green14 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[0,0], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(GREEN[7], tr)}));
        green14.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        green14.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        green14.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); green14.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        green14.align.flags = ALIGN_2.HORIZONTAL
        black1.AddItem(green14);
    
    
    //     const bla = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(GREY[0], tr)}));
    //     bla.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     bla.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); bla.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    //     black3.AddItem(bla);
    //     const pin_1 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(PURPLER[7], tr)}));
    //     pin_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     pin_1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); pin_1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    //     black4.AddItem(pin_1);
    //     const blu_1 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(BLUEL[7], tr)}));
    //     blu_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     blu_1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); blu_1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    //     black4.AddItem(blu_1);
    //     const yel_2 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(YELLOWR[7], tr)}));
    //     yel_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     yel_2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); yel_2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    //     black2.AddItem(yel_2);
    //     const yel_3 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(ORANGE_240_160_10, tr)}));
    //     yel_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     yel_3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); yel_3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    //     black3.AddItem(yel_3);
    //     const gre_3 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(ORANGE_240_160_10, tr)}));
    //     gre_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     gre_3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); gre_3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    //     black3.AddItem(gre_3);
    //     const red_4 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(PURPLE[7], tr)}));
    //     red_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     red_4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); red_4.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    //     black2.AddItem(red_4);
    //     const yel_4 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(PURPLE[7], tr)}));
    //     yel_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     yel_4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); yel_4.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    //     black2.AddItem(yel_4);
    //     const ora_4 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(ORANGE_240_160_10, tr)}));
    //     ora_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     ora_4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); ora_4.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    //     black2.AddItem(ora_4);
    //     const gry1_1 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(ORANGE_240_160_10, tr)}));
    //     gry1_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     gry1_1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); gry1_1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    //     bla.AddItem(gry1_1);
    //     const gry1_2 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(GREY[5], tr)}));
    //     gry1_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     gry1_2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); gry1_2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    //     bla.AddItem(gry1_2);
    //     const gry1_3 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(GREY[7], tr)}));
    //     gry1_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     gry1_3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); gry1_3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    //     bla.AddItem(gry1_3);
    //     const gry2_1 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(GREY[1], tr)}));
    //     gry2_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     gry2_1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); gry2_1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    //     pin_1.AddItem(gry2_1);
    //     const gry2_2 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(GREY[1], tr)}));
    //     gry2_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     gry2_2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); gry2_2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    //     pin_1.AddItem(gry2_2);
    //     const gry2_3 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(GREY[1], tr)}));
    //     gry2_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     gry2_3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); gry2_3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    //     blu_1.AddItem(gry2_3);
    //     const gry2_4 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(GREY[1], tr)}));
    //     gry2_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     gry2_4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); gry2_4.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    //     blu_1.AddItem(gry2_4);
    //     const vert_0 = Create_rect_mesh(Style_rect_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(GREY[1], tr)}));
    //     vert_0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     vert_0.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); vert_0.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    //     gry1_1.AddItem(vert_0);
    // }


    // { // Set naming and listeners
    //     red.SetName('red');
    //     grey11.SetName('grey11');
    //     black1.SetName('black1');
    //     black2.SetName('black2');
    //     black3.SetName('black3');
    //     bla.SetName('bla');
    //     black4.SetName('black4');
    //     pin_1.SetName('pin_1');
    //     blu_1.SetName('blu_1');
    //     purp12.SetName('purp12');
    //     red111.SetName('red111');
    //     yel_1.SetName('yel_1');
    //     yel_2.SetName('yel_2');
    //     blue13.SetName('blue13');
    //     yel_3.SetName('yel_3');
    //     gre_3.SetName('gre_3');
    //     red_4.SetName('red_4');
    //     yel_4.SetName('yel_4');
    //     green14.SetName('green14');
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


    const ret = Align_pre_simple(blu);

    // blu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    blu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    blu.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    // blu.options = SECTION.INHERIT | SECTION.VERTICAL | SECTION.RESIZE_PARENT;
    // blu.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.RESIZE_PARENT;
    // blu.Calc_no_gfx_update();
    blu.Render();
    Root_group_activate_all_vbs_in_renderqueue(blu.root_bufferidx);
    blu.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, blu.gfx.vb.groupidx);

    Construct_listen_events_from_mesh_tree(blu)
    Construct_listen_events_relations_from_mesh_tree(blu)

    return blu;
}
// function CreateManySections(scene) {

//     const tr = .4;
//     const rcorners1 = 10;
//     const rcorners2 = 10;

//     // const blu = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [15, 15], [365, 400, 0], [100, 100], TRANSPARENCY(BLUEL[7], tr));
//     // const blu = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [15, 15], [0, 400, 0], [100, 100], TRANSPARENCY(BLUEL[7], tr));
//     const blu = Create_widget_section(Style_section_default_properties({is_root: ROOT_WIDGETS.CREATE_ROOT, options:SECTION.VERTICAL, pad:[15, 15], pos:[0, 400, 0], dim:[100, 100], col:TRANSPARENCY(BLUEL[7], tr)}));
//     blu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//     blu.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners1);
//     blu.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     blu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE); blu.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);


//     // blu.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3)

//     const red = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[15, 15], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(REDL[7], tr)}));
//     red.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//     red.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners1);
//     red.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     red.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     // red.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.EXPAND;
//     red.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.VERTICAL;
//     blu.AddItem(red);


//     const black1 = Create_widget_section(Style_section_default_properties({options:SECTION.HORIZONTAL, pad:[15, 15], pos:[0, 0, 1], dim:[20, 20], col:TRANSPARENCY(BLACK, tr)}));
//     black1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//     black1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners1); black1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     black1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     red.AddItem(black1);


//     const black2 = Create_widget_section(Style_section_default_properties({options:SECTION.HORIZONTAL, pad:[15, 15], pos:[0, 0, 1], dim:[20, 20], col:TRANSPARENCY(BLACK, tr)}));
//     black2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//     black2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     black2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners1); black2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     red.AddItem(black2);

//     const black3 = Create_widget_section(Style_section_default_properties({options:SECTION.HORIZONTAL, pad:[15, 15], pos:[0, 0, 1], dim:[20, 20], col:TRANSPARENCY(BLACK, tr)}));
//     black3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//     black3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     black3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners1); black3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     red.AddItem(black3);


//     const black4 = Create_widget_section(Style_section_default_properties({options:SECTION.HORIZONTAL, pad:[15, 15], pos:[0, 0, 1], dim:[20, 20], col:TRANSPARENCY(GREY[1], tr)}));
//     black4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     black4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners1); black4.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     red.AddItem(black4);


//     const grey11 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[15, 15], pos:[0, 0, 2], dim:[20, 20], col:TRANSPARENCY(GREY[4], tr)}));
//     grey11.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     grey11.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); grey11.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     black1.AddItem(grey11);
//     const red111 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[15, 15], pos:[0, 0, 2], dim:[20, 20], col:TRANSPARENCY(REDL[7], tr)}));
//     red111.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     red111.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); red111.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     grey11.AddItem(red111);
//     const yel_1 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[15, 15], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(YELLOWR[7], tr)}));
//     yel_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     yel_1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); yel_1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     grey11.AddItem(yel_1);
//     const purp12 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[15, 15], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(PURPLE[7], tr)}));
//     purp12.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     purp12.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); purp12.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     black1.AddItem(purp12);
//     const blue13 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[15, 15], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(BLUEL[5], tr)}));
//     blue13.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     blue13.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); blue13.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     black1.AddItem(blue13);
//     const green14 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[15, 15], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(GREEN[7], tr)}));
//     green14.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     green14.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); green14.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     black1.AddItem(green14);


//     const bla = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(GREY[0], tr)}));
//     bla.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     bla.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); bla.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     black3.AddItem(bla);
//     const pin_1 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(PURPLER[7], tr)}));
//     pin_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     pin_1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); pin_1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     black4.AddItem(pin_1);
//     const blu_1 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(BLUEL[7], tr)}));
//     blu_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     blu_1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); blu_1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     black4.AddItem(blu_1);
//     const yel_2 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(YELLOWR[7], tr)}));
//     yel_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     yel_2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); yel_2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     black2.AddItem(yel_2);
//     const yel_3 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(ORANGE_240_160_10, tr)}));
//     yel_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     yel_3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); yel_3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     black3.AddItem(yel_3);
//     const gre_3 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(ORANGE_240_160_10, tr)}));
//     gre_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     gre_3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); gre_3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     black3.AddItem(gre_3);
//     const red_4 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(PURPLE[7], tr)}));
//     red_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     red_4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); red_4.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     black2.AddItem(red_4);
//     const yel_4 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(PURPLE[7], tr)}));
//     yel_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     yel_4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); yel_4.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     black2.AddItem(yel_4);
//     const ora_4 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(ORANGE_240_160_10, tr)}));
//     ora_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     ora_4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); ora_4.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     black2.AddItem(ora_4);
//     const gry1_1 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(ORANGE_240_160_10, tr)}));
//     gry1_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     gry1_1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); gry1_1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     bla.AddItem(gry1_1);
//     const gry1_2 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(GREY[5], tr)}));
//     gry1_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     gry1_2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); gry1_2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     bla.AddItem(gry1_2);
//     const gry1_3 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(GREY[7], tr)}));
//     gry1_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     gry1_3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); gry1_3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     bla.AddItem(gry1_3);
//     const gry2_1 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(GREY[1], tr)}));
//     gry2_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     gry2_1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); gry2_1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     pin_1.AddItem(gry2_1);
//     const gry2_2 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(GREY[1], tr)}));
//     gry2_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     gry2_2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); gry2_2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     pin_1.AddItem(gry2_2);
//     const gry2_3 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(GREY[1], tr)}));
//     gry2_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     gry2_3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); gry2_3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     blu_1.AddItem(gry2_3);
//     const gry2_4 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(GREY[1], tr)}));
//     gry2_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     gry2_4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); gry2_4.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     blu_1.AddItem(gry2_4);
//     const vert_0 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, 0], dim:[20, 20], col:TRANSPARENCY(GREY[1], tr)}));
//     vert_0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     vert_0.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners2); vert_0.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//     gry1_1.AddItem(vert_0);

//     { // Set naming and listeners
//         red.SetName('red');
//         grey11.SetName('grey11');
//         black1.SetName('black1');
//         black2.SetName('black2');
//         black3.SetName('black3');
//         bla.SetName('bla');
//         black4.SetName('black4');
//         pin_1.SetName('pin_1');
//         blu_1.SetName('blu_1');
//         purp12.SetName('purp12');
//         red111.SetName('red111');
//         yel_1.SetName('yel_1');
//         yel_2.SetName('yel_2');
//         blue13.SetName('blue13');
//         yel_3.SetName('yel_3');
//         gre_3.SetName('gre_3');
//         red_4.SetName('red_4');
//         yel_4.SetName('yel_4');
//         green14.SetName('green14');
//         ora_4.SetName('ora_4');
//         gry1_1.SetName('gry1_1');
//         gry1_2.SetName('gry1_2');
//         gry1_3.SetName('gry1_3');
//         gry2_1.SetName('gry2_1');
//         gry2_2.SetName('gry2_2');
//         gry2_3.SetName('gry2_3');
//         gry2_4.SetName('gry2_4');
//         vert_0.SetName('vert_0');
//     }


//     // blu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//     blu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//     blu.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
//     // blu.options = SECTION.INHERIT | SECTION.VERTICAL | SECTION.RESIZE_PARENT;
//     blu.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.RESIZE_PARENT;
//     blu.Calc_no_gfx_update();
//     blu.Render();
//     Root_group_activate_all_vbs_in_renderqueue(blu.root_bufferidx);
//     blu.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, blu.gfx.vb.groupidx);

//     Construct_listen_events_from_mesh_tree(blu)
//     Construct_listen_events_relations_from_mesh_tree(blu)

//     return blu;
// }


function Test_align_many_sliders() {

    const pos = [400, 0, 0];
    const tex_id = TEXTURES.MTSDF_CONSOLAS_1024
    const fonst_size = 8

    const root = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pos:pos, dim:[20, 20], col:TRANSPARENCY(BLUEL[5], 1)}));
    root.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    root.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    root.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    root.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    root.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    root.align.flags = ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF;
    root.SetName('root');
    root.StylesSetPad([10,10])
    

    { // Test 2 Sliders
        const r1 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(YELLOWL[5], 1)}));
        r1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        r1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        r1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        r1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        // r1.align.flags = ALIGN_2.HORIZONTAL;
        r1.align.flags = ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF;
        // r1.align.flags = ALIGN_2.RESIZE_SELF;
        r1.SetName('1')
        r1.StylesSetPad([10,10])
        root.AddItem(r1)
        
        { 
            const r2 = Create_widget_slider_simple(Style_slider_simple_default_properties({pos:pos, dim:[120, 10], col:PURPLE[5]}));
            r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
            r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            r2.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
            r2.align.flags = ALIGN_2.VERTICAL;
            r1.AddItem(r2)
        }
        { 
            const r2 = Create_widget_slider(Style_slider_default_properties({pos:pos, dim:[120, 10], col:PURPLE[5]}));
            r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
            r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            r2.align.flags = ALIGN_2.VERTICAL;
            r1.AddItem(r2)
        }
        { 
            const r2 = Create_widget_slider(Style_slider_default_properties({pos:pos, dim:[120, 10], col:PURPLE[5]}));
            r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
            r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            r2.align.flags = ALIGN_2.HORIZONTAL;
            r1.AddItem(r2)
        }
        { 
            const r2 = Create_widget_slider(Style_slider_default_properties({pos:pos, dim:[120, 10], col:PURPLE[5]}));
            r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
            r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            r2.align.flags = ALIGN_2.VERTICAL;
            r1.AddItem(r2)
        }
        { 
            const r2 = Create_widget_slider_simple(Style_slider_simple_default_properties({pos:pos, dim:[120, 10], col:PURPLE[5]}));
            r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
            r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            r2.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
            r2.align.flags = ALIGN_2.VERTICAL;
            r1.AddItem(r2)
        }

    }


    {
        /** */
        { // Test 1
            const r1 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(YELLOWL[5], 1)}));
            r1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            r1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
            r1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            r1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            // r1.align.flags = ALIGN_2.HORIZONTAL;
            r1.align.flags = ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF;
            // r1.align.flags = ALIGN_2.RESIZE_SELF;
            r1.SetName('1')
            r1.StylesSetPad([10,10])
            root.AddItem(r1)
            // { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags |= ALIGN_2.HORIZONTAL; r1.AddItem(label); }
            // { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags |= ALIGN_2.VERTICAL; r1.AddItem(label); }
            
            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.VERTICAL;
                r2.SetName('1-1')
                r1.AddItem(r2)
            }
            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.VERTICAL;
                r2.SetName('1-1')
                r1.AddItem(r2)
            }
    
        }
        /** */
        // { // Test 1
        //     const r1 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(ORANGER[5], 1)}));
        //     r1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        //     r1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        //     r1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        //     r1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     // r1.align.flags = ALIGN_2.HORIZONTAL;
        //     r1.align.flags = ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF;
        //     // r1.align.flags = ALIGN_2.RESIZE_SELF;
        //     r1.SetName('ORANGER')
        //     r1.StylesSetPad([10,10])
        //     root.AddItem(r1)
        //     // { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags |= ALIGN_2.HORIZONTAL; r1.AddItem(label); }
        //     // { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags |= ALIGN_2.VERTICAL; r1.AddItem(label); }
            
        //     { 
        //         const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(GREY[3], 1)}));
        //         r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        //         r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        //         r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        //         r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //         r2.align.flags = ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF;
        //         r2.SetName('ORANGER-1')
        //         r2.StylesSetPad([25,25])
        //         r1.AddItem(r2)
        //         { const label = Widget_ready_label(_, `B1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags |= ALIGN_2.HORIZONTAL; r2.AddItem(label); }
        //         { const label = Widget_ready_label(_, `B2`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags |= ALIGN_2.HORIZONTAL; r2.AddItem(label); }
        //         { const label = Widget_ready_label(_, `B3`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags |= ALIGN_2.HORIZONTAL; r2.AddItem(label); }
        //         { const label = Widget_ready_label(_, `B4`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags |= ALIGN_2.HORIZONTAL; r2.AddItem(label); }
        //         { const label = Widget_ready_label(_, `B5`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags |= ALIGN_2.HORIZONTAL; r2.AddItem(label); }
        //         // { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags |= ALIGN_2.VERTICAL; r2.AddItem(label); }
        //     }
        //     { 
        //         const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
        //         r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        //         r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        //         r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        //         r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //         r2.align.flags = ALIGN_2.VERTICAL;
        //         r2.SetName('ORANGER-1')
        //         r1.AddItem(r2)
        //     }
        //     { 
        //         const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
        //         r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        //         r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        //         r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        //         r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //         r2.align.flags = ALIGN_2.VERTICAL;
        //         r2.SetName('ORANGER-1')
        //         r1.AddItem(r2)
        //     }
        //     { 
        //         const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
        //         r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        //         r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        //         r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        //         r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //         r2.align.flags = ALIGN_2.VERTICAL;
        //         r2.SetName('ORANGER-1')
        //         r1.AddItem(r2)
        //     }
        //     { 
        //         const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
        //         r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        //         r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        //         r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        //         r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //         r2.align.flags = ALIGN_2.VERTICAL;
        //         r2.SetName('ORANGER-1')
        //         r1.AddItem(r2)
        //     }
    
        // }        
        /** */
        { 
            const r1 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(YELLOWL[5], 1)}));
            r1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            r1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
            r1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            r1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            // r1.align.flags = ALIGN_2.HORIZONTAL;
            r1.align.flags = ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF;
            r1.SetName('2')
            r1.StylesSetPad([10,10])
            root.AddItem(r1)

            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.HORIZONTAL;
                r2.SetName('1-1')
                r1.AddItem(r2)
            }
            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.HORIZONTAL;
                r2.SetName('3-1')
                r1.AddItem(r2)
            }
            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.VERTICAL;
                r2.SetName('3-1')
                r1.AddItem(r2)
            }
            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.HORIZONTAL;
                r2.SetName('3-1')
                r1.AddItem(r2)
            }
            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.HORIZONTAL;
                r2.SetName('3-1')
                r1.AddItem(r2)
            }
        }
        /** */
        { 
            const r1 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(YELLOWL[5], 1)}));
            r1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            r1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
            r1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            r1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            // r1.align.flags = ALIGN_2.HORIZONTAL;
            r1.align.flags = ALIGN_2.VERTICAL|ALIGN_2.RESIZE_SELF;
            r1.SetName('3')
            r1.StylesSetPad([10,10])
            root.AddItem(r1)
            { 
                const r2 = Create_widget_slider_simple(Style_slider_simple_default_properties({pos:pos, dim:[120, 10], col:PURPLE[5]}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.align.flags = ALIGN_2.VERTICAL;
                r2.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
                r1.AddItem(r2)
            }
            { 
                const r2 = Create_widget_slider(Style_slider_default_properties({pos:pos, dim:[120, 10], col:PURPLE[5]}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.align.flags = ALIGN_2.VERTICAL;
                r1.AddItem(r2)
            }
            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.HORIZONTAL;
                r2.SetName('3-1')
                r1.AddItem(r2)
            }
            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.HORIZONTAL;
                r2.SetName('3-1')
                r1.AddItem(r2)
            }
            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.HORIZONTAL;
                r2.SetName('3-1')
                r1.AddItem(r2)
            }
            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.HORIZONTAL;
                r2.SetName('3-1')
                r1.AddItem(r2)
            }
            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.HORIZONTAL;
                r2.SetName('3-1')
                r1.AddItem(r2)
            }
            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.VERTICAL;
                r2.SetName('4-2')
                r1.AddItem(r2)
            }
            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.HORIZONTAL;
                r2.SetName('4-1')
                r1.AddItem(r2)
            }
            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.VERTICAL;
                r2.SetName('3-2')
                r1.AddItem(r2)
            }
            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.VERTICAL;
                r2.SetName('3-2')
                r1.AddItem(r2)
            }
            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.VERTICAL;
                r2.SetName('3-2')
                r1.AddItem(r2)
            }
            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.VERTICAL;
                r2.SetName('3-2')
                r1.AddItem(r2)
            }
        }
        /** */
        { 
            const r1 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(GREEN[5], 1)}));
            r1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            r1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
            r1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            r1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            // r1.align.flags = ALIGN_2.HORIZONTAL;
            r1.align.flags = ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF;
            r1.SetName('4')
            r1.StylesSetPad([10,10])
            root.AddItem(r1)

            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.HORIZONTAL;
                r2.SetName('4-1')
                r1.AddItem(r2)
            }
            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.VERTICAL;
                r2.SetName('4-2')
                r1.AddItem(r2)
            }
            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.VERTICAL;
                r2.SetName('4-2')
                r1.AddItem(r2)
            }
            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.HORIZONTAL;
                r2.SetName('4-1')
                r1.AddItem(r2)
            }            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.HORIZONTAL;
                r2.SetName('4-1')
                r1.AddItem(r2)
            }            { 
                const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
                r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
                r2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                r2.align.flags = ALIGN_2.VERTICAL;
                r2.SetName('4-1')
                r1.AddItem(r2)
            }
        }
        /** */
        { 
            const r1 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(ORANGE[5], 1)}));
            r1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            r1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
            r1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            r1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            r1.align.flags = ALIGN_2.VERTICAL;
            r1.SetName('4')
            // r1.StylesSetPad([10,10])
            root.AddItem(r1)
        }
        /** */
        { // Test 1
            const r1 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(YELLOW[5], 1)}));
            r1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            r1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
            r1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            r1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            r1.align.flags = ALIGN_2.HORIZONTAL;
            r1.SetName('5')
            root.AddItem(r1)
        }
    }
    


    /********************************************************************************************************************************************************/
    // Align
    const ret = Align_pre_simple(root);


    root.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);

    // root.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.RESIZE_PARENT;
    // root.Calc_no_gfx_update();

    root.Render();

    root.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, root.gfx.vb.groupidx);

    Root_group_activate_all_vbs_in_renderqueue(root.root_bufferidx);
    Construct_listen_events_from_mesh_tree(root)
    Construct_listen_events_relations_from_mesh_tree(root);
}



function Test_performance_align_functions() {

    const num = 15
    const section1 = Test_performance_align_functions_1(20, 100, num);
    {
        const fps_label = Create_widget_label(_, '0000000', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 1], fontsize, BLUEL[1], WHITE, [20, 10], .5,);
        {
            fps_label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
            fps_label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
            fps_label.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
            section1.AddItem(fps_label);
            // fps_label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            // fps_label.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
            // fps_label.Render();
            // fps_label.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, fps_label.gfx.vb.groupidx);
            // Construct_listen_events_from_mesh_tree(fps_label)
            // Construct_listen_events_relations_from_mesh_tree(fps_label)
        }

        // blu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        section1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        section1.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
        section1.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.RESIZE_PARENT;
        section1.Calc_no_gfx_update();
        /********************************************************************************************************************************************************/
        // Align
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
        section1.Render();
        Root_group_activate_all_vbs_in_renderqueue(section1.root_bufferidx);
        section1.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section1.gfx.vb.groupidx);

        Construct_listen_events_from_mesh_tree(section1)
        Construct_listen_events_relations_from_mesh_tree(section1)
    }
    const section2 = Test_performance_align_functions_2(220, 100, num);
    // const section2 = Test_alignment_nested_2(220, 100);

    {


        const fps_label = Create_widget_label(_, '0000000', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 1], fontsize, PURPLER[1], WHITE, [20, 10], .5,);
        {
            fps_label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
            fps_label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
            fps_label.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
            section2.AddItem(fps_label);
            // fps_label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            // fps_label.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
            // fps_label.Render();
            // fps_label.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, fps_label.gfx.vb.groupidx);
            // Construct_listen_events_from_mesh_tree(fps_label)
            // Construct_listen_events_relations_from_mesh_tree(fps_label)
        }

        /********************************************************************************************************************************************************/
        // Align
        const update = function (params) {
            Performance_timer_start(PERFORMANCE_TIMERS_IDXS.MiscTest4)
            const section = params.params.mesh;
            const ret = Align_pre_simple(section);
            const pad_x = section.StylesGetPad(STYLES.AXIS.X);
            const pad_y = section.StylesGetPad(STYLES.AXIS.Y);
            section.geom.dim[0] = ret.dim_x + pad_x;
            section.geom.dim[1] = ret.dim_y + pad_y;
            // Align_position_pre(section);
            Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.MiscTest4)

            const fps = PerformanceTimersGetFps([PERFORMANCE_TIMERS_IDXS.MiscTest4, 0])
            params.params.fps_label.text_mesh.RenderTextFromNumber(Math.trunc(fps));
            // const ms = PerformanceTimersGetMilisec([PERFORMANCE_TIMERS_IDXS.MiscTest4, 0])
            // params.params.fps_label.text_mesh.RenderTextFromNumber(ms);
        }
        update({ params: { mesh: section2, fps_label: fps_label } })
        Time_intervals_create(1, 'Mesh info tip', TIME_INTERVAL_REPEAT_ALWAYS, update, { mesh: section2, fps_label: fps_label });

        // blu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        section2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        section2.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);

        section2.Render();
        // Root_group_activate_all_vbs_in_renderqueue(section2.root_bufferidx);
        section2.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section2.gfx.vb.groupidx);

        Construct_listen_events_from_mesh_tree(section2)
        Construct_listen_events_relations_from_mesh_tree(section2)
    }


}
function Test_performance_align_functions_1(x, y, num = 10) {

    const tr = 1.;

    // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [15, 15], [365, 400, 0], [100, 100], TRANSPARENCY(BLUEL[7], tr));
    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [15, 15], [x, y, 0], [100, 100], TRANSPARENCY(BLUEL[7], tr));
    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE); section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);


    // section.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3)

    const s0 = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(REDL[7], tr));
    s0.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    s0.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    s0.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    s0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    section.AddItem(s0);


    {
        const s1 = Create_widget_section(_, SECTION.VERTICAL, [12, 12], [0, 0, 0], [20, 20], TRANSPARENCY(BLACK, tr));
        s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
        s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        s0.AddItem(s1);
        for (let i = 0; i < num; i++) {
            {
                const s3 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 2], [0, 0], PURPLEB[7]); s1.AddItem(s3); s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                {
                    const s2 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 2], [0, 0], GREEN[5]); s3.AddItem(s2); s2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s2.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                    { const s = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                    { const s = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                    { const s = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                    { const s = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                }
                {
                    const s2 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 2], [0, 0], GREEN[5]); s3.AddItem(s2); s2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s2.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                    { const s = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                    { const s = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                    { const s = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                    { const s = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                }
                {
                    const s2 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 2], [0, 0], GREEN[5]); s3.AddItem(s2); s2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s2.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                    { const s = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                    { const s = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                    { const s = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                    { const s = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                }
            }
        }

    }

    return section;
}
function Test_performance_align_functions_2(x, y, num = 10) {

    const tr = 1.;

    // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [15, 15], [365, 400, 0], [100, 100], TRANSPARENCY(BLUEL[7], tr));
    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [15, 15], [x, y, 0], [100, 100], TRANSPARENCY(BLUEL[7], tr));
    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    section.align.flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE); section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);


    // section.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3)

    const s0 = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(REDL[7], tr));
    s0.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    s0.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    s0.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    s0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    s0.align.flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL
    section.AddItem(s0);


    {
        const s1 = Create_widget_section(_, SECTION.HORIZONTAL, [12, 12], [0, 0, 0], [20, 20], TRANSPARENCY(BLACK, tr));
        s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
        s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        s1.align.flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL
        s0.AddItem(s1);

        for (let i = 0; i < num; i++) {

            {
                const s3 = Create_widget_section(_, _, [10, 10], [0, 0, 2], [0, 0], PURPLEB[7]); s1.AddItem(s3); s3.align.flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                {
                    const s2 = Create_widget_section(_, _, [10, 10], [0, 0, 2], [0, 0], GREEN[5]); s3.AddItem(s2); s2.align.flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s2.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                    { const s = Create_widget_section(_, _, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.align.flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                    { const s = Create_widget_section(_, _, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.align.flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                    { const s = Create_widget_section(_, _, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.align.flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                    { const s = Create_widget_section(_, _, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.align.flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                }
                {
                    const s2 = Create_widget_section(_, _, [10, 10], [0, 0, 2], [0, 0], GREEN[5]); s3.AddItem(s2); s2.align.flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s2.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                    { const s = Create_widget_section(_, _, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.align.flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                    { const s = Create_widget_section(_, _, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.align.flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                    { const s = Create_widget_section(_, _, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.align.flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                    { const s = Create_widget_section(_, _, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.align.flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                }
                {
                    const s2 = Create_widget_section(_, _, [10, 10], [0, 0, 2], [0, 0], GREEN[5]); s3.AddItem(s2); s2.align.flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s2.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                    { const s = Create_widget_section(_, _, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.align.flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                    { const s = Create_widget_section(_, _, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.align.flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                    { const s = Create_widget_section(_, _, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.align.flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                    { const s = Create_widget_section(_, _, [10, 10], [0, 0, 3], [0, 0], GREY[4]); s2.AddItem(s); s.align.flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }
                }
            }
        }

    }



    return section;
}




function CreateScrollerClampAlphaTest(is_root = ROOT_WIDGETS.CREATE_ROOT, x=0, y=0, num_items = 10, font_size=8) {

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
    const section = Create_rect_mesh(Style_rect_default_properties({is_root:is_root, pad:[10, 10], pos:[x, y, 0], dim:[20, 20], col:TRANSPARENCY(GREY[0], 1.)}));
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 15);
    section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    section.align.flags = ALIGN_2.HORIZONTAL|ALIGN_2.RESIZE_SELF;



    // const count = colors.length;
    const count = num_items;
    for (let i = 0; i < count; i++) {

        const label = Create_widget_label(Style_label_default_properties({ text: `${i}`, pos: [0, 0, 1], font_size: fontsize, col: TRANSPARENCY(colors[i], .8), text_pad: [6, 4] }))
        label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        label.align.flags = ALIGN_2.VERTICAL;
        label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
        section.AddItem(label);
    }



    if (_is_root & ROOT_WIDGETS.CREATE_ROOT) {

        Align_pre_simple(section)

        section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        section.options = SECTION.VERTICAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
        section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        // section.Calc_no_gfx_update();


        View_build_group_from_root_mesh(section);

        section.Render();
        Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

        section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

        Construct_listen_events_from_mesh_tree(section)
        Construct_listen_events_relations_from_mesh_tree(section);



        const scroller_height = 100;
        const scroller_component = Components_create_scroller_component(10, scroller_height, section, 100);
        Scoller_component_gengfx_and_render(scroller_component, section);
        Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(section.root_posidx, scroller_component.root_posidx);
        section.AddChildScrollerIdx(section.scroller_comp_idx);
        Listeners_set_priority(E.C, scroller_component.listeners)

        Scroller_component_calculate_handle_pos_dim(section, scroller_component);


        // Set scissor box
        const mx = section.mesh_bufferidx;
        const my = scroller_component.mesh_bufferidx;
        const mw = section.mesh_bufferidx;
        const mh = scroller_component.mesh_bufferidx;
        Vertex_buffer_group_create_scissorbox(section.gfx.vb.groupidx, mx, my, mw, mh);


        // Unfortunately must Re-render the section for the clipping of the scroller to take place
        Root_group_reset_gfxs(section.root_bufferidx);
        Root_group_rerender_from_root_reconstruct_listeners(section.root_bufferidx);

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

    return section;
}





function TestScrollerComponentDropdown() {

    const dp = CreateDropdownTree([0, 0, 0], ROOT_WIDGETS.CREATE_ROOT);

    const scroller_component = Components_create_scroller_component(_, 100, dp, dp.GetPosY(),);
    Scoller_component_gengfx_and_render(scroller_component, dp);
    Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(dp.root_posidx, scroller_component.root_posidx)
    dp.AddChildScrollerIdx(dp.scroller_comp_idx);

    // Listeners_set_priority(E.C, scroller_component.listeners);
    // Scroller_component_calculate_handle_pos_dim(controls_section, scroller_component);

    // Set scissor box
    const mx = dp.mesh_bufferidx;
    const my = scroller_component.mesh_bufferidx;
    const mw = dp.mesh_bufferidx;
    const mh = scroller_component.mesh_bufferidx;
    Vertex_buffer_group_create_scissorbox(dp.gfx.vb.groupidx, mx, my, mw, mh);
}
function TestScrollerComponent2() {

    const rcorners = 15;
    {

        const s = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[10, 10], pos:[100, 100, 0], dim:[100, 40], col:GREY[4]}));
        Widget_gfx_ready_enable_default(s, rcorners)
        s.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        s.SetName('Main Section');



        let mesh_to_add_scroller1 = null;
        {
            const s2 = Create_rect_mesh(Style_rect_default_properties({ pad:[10, 10], pos:[0, 0, 0], dim:[100, 40], col:YELLOWR[4]}));
            Widget_gfx_ready_enable_default(s2, rcorners);
            s.AddItem(s2)
            s2.SetName('SS1');
            s2.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;

            const dp = Create_widget_dropdown(Style_dropdown_default_properties({ name:'DP2', pos:[0, 0, 1], col:GREY[1], }));
            Widget_gfx_ready_enable_default(dp, rcorners)
            Dropdown_roots_set_root(dp, dp);
            dp.SetName('DP1');
            s2.AddItem(dp)

            for (let i = 0; i < 2; i++) {

                const s3 = Create_rect_mesh(Style_rect_default_properties({ pad:[10, 10], pos:[0, 0, 0], dim:[100, 40], col:BLUEL[4]}));
                Widget_gfx_ready_enable_default(s3, rcorners)
                s3.SetName('S3');
                dp.AddToMenu(s3)

                const dp1 = Create_widget_dropdown(Style_dropdown_default_properties({ name:'DP' + i, pos:[0, 0, 1], col:GREY[1], }));
                Widget_gfx_ready_enable_default(dp1, rcorners);
                dp1.SetName('DP' + i);
                Dropdown_roots_set_root(dp, dp1);
                // dp.AddToMenu(dp1)
                s3.AddItem(dp1)


                const l = Create_widget_label(Style_label_default_properties({text:'label +++' + i, col:YELLOWL[6],  text_pad:[5, 5], texture_id:TEXTURES.MTSDF_CONSOLAS_1024, font_size:10}));
                Widget_gfx_ready_enable_default(l, rcorners)
                dp1.AddToMenu(l)

            }

            // dp.gfx_ctx_flags |= GFX_CTX_FLAGS.FROM_PARENT_ASC|GFX_CTX_FLAGS.PRIVATE;
            // dp.GfxCtxSetFlag( dp.gfx_ctx_flags, dp.mesh_bufferidx);

            mesh_to_add_scroller1 = s2;

        }
        let mesh_to_add_scroller2 = null;
        // {

        //     const s2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [100, 40], YELLOWR[4]);
        //     Widget_gfx_ready_enable_default(s2, rcorners);

        //     s.AddItem(s2)
        //     s2.SetName('SS2');
        //     s2.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;

        //     const dp = Create_widget_dropdown(_, 'DP1', [0, 0, 1], GREY[1], PURPLEB[2], _, _, _,);
        //     Widget_gfx_ready_enable_default(dp, rcorners);
        //     Dropdown_roots_set_root(dp, dp);
        //     dp.SetName('DP2');
        //     s2.AddItem(dp)

        //     for (let i = 0; i < 2; i++) {

        //         const s3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [100, 40], BLUEL[4]);
        //         Widget_gfx_ready_enable_default(s3, rcorners);
        //         s3.SetName('S3');
        //         dp.AddToMenu(s3)

        //         const dp1 = Create_widget_dropdown(_, 'DP' + i, [0, 0, 1], GREY[1], PURPLEB[2], _, _, _,);
        //         Widget_gfx_ready_enable_default(dp1, rcorners);
        //         dp1.SetName('DP' + i);
        //         Dropdown_roots_set_root(dp, dp1);
        //         // dp.AddToMenu(dp1)
        //         s3.AddItem(dp1)


        //         const l = Create_widget_label(_, 'lklhjksqdkjluhujkuhjhsdsz' + i, _, _, _, YELLOWL[6], _, [5, 5]);
        //         Widget_gfx_ready_enable_default(l, rcorners);
        //         dp1.AddToMenu(l)

        //     }

        //     dp.gfx_ctx_flags |= GFX_CTX_FLAGS.FROM_PARENT_ASC | GFX_CTX_FLAGS.PRIVATE;
        //     dp.GfxCtxSetFlag(dp.gfx_ctx_flags, dp.mesh_bufferidx);

        //     mesh_to_add_scroller2 = s2;
        // }

        Align_pre_simple(s)

        // // s.options = SECTION.VERTICAL|SECTION.FIXED_H
        s.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT
        s.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);

        // s.Calc_no_gfx_update();

        s.Render();
        Root_group_activate_all_vbs_in_renderqueue(s.root_bufferidx);

        Construct_listen_events_from_mesh_tree(s);
        Construct_listen_events_relations_from_mesh_tree(s);

        s.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, s.gfx.vb.groupidx);

        View_build_group_from_root_mesh(s);

        // View_build_group_from_root_mesh(mesh_to_add_scroller1);
        // View_build_group_from_root_mesh(mesh_to_add_scroller2);


        const scroller_component1 = Components_create_scroller_component(_, 100, mesh_to_add_scroller1, mesh_to_add_scroller1.GetPosY(),);
        Scoller_component_gengfx_and_render(scroller_component1, mesh_to_add_scroller1);
        Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(mesh_to_add_scroller1.root_posidx, scroller_component1.root_posidx);
        mesh_to_add_scroller1.AddChildScrollerIdx(mesh_to_add_scroller1.scroller_comp_idx);
        Listeners_set_priority(E.C, scroller_component1.listeners)


        const scroller_component2 = Components_create_scroller_component(_, 100, mesh_to_add_scroller2, mesh_to_add_scroller2.GetPosY());
        Scoller_component_gengfx_and_render(scroller_component2, mesh_to_add_scroller2);
        Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(mesh_to_add_scroller2.root_posidx, scroller_component2.root_posidx);
        mesh_to_add_scroller2.AddChildScrollerIdx(mesh_to_add_scroller2.scroller_comp_idx);
        Listeners_set_priority(E.C, scroller_component2.listeners)

    }

}
function TestScrollerComponent3() {

    const rcorners = 12;

    const s = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [0, 0, 0], [100, 40], GREY[4]);
    s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    s.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    Widget_gfx_ready_enable_default(s, rcorners);
    s.SetName('Scrolled Section');



    let scrolled_meshes_buffer = [];

    const s2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [100, 40], YELLOWR[4]);
    Widget_gfx_ready_enable_default(s2, rcorners);
    s.AddItem(s2)
    s2.SetName('SS2');


    const dp = Create_widget_dropdown(_, 'DP', [0, 0, 1], GREY[1], PURPLEB[2], _, _, _,);
    Widget_gfx_ready_enable_default(dp, rcorners);
    Dropdown_roots_set_root(dp, dp);
    dp.SetName('DP');
    s2.AddItem(dp)

    // s2.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;
    // s2.GfxCtxSetFlag(s2.gfx_ctx_flags, s2.mesh_bufferidx);
    scrolled_meshes_buffer.push(s2);


    for (let i = 0; i < 3; i++) {

        const dp1 = Create_widget_dropdown(_, 'DP' + i, [0, 0, 1], GREY[1], PURPLEB[2], _, _, _,);
        Widget_gfx_ready_enable_default(dp1, rcorners);
        dp1.SetName('DP' + i);
        Dropdown_roots_set_root(dp, dp1);
        dp.AddToMenu(dp1)

        dp1.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;
        dp1.GfxCtxSetFlag(dp1.gfx_ctx_flags, dp1.mesh_bufferidx);
        scrolled_meshes_buffer.push(dp1);

        for (let j = 0; j < 1; j++) {

            const s3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [10, 10, 0], [100, 40], BLUEL[4]);
            Widget_gfx_ready_enable_default(s3, rcorners);
            s3.SetName('S3');
            dp1.AddToMenu(s3)

            const dp2 = Create_widget_dropdown(_, 'DP' + j, [0, 0, 1], GREY[1], PURPLEB[2], _, _, _,);
            Widget_gfx_ready_enable_default(dp2, rcorners);
            dp2.SetName('DP' + j);
            Dropdown_roots_set_root(dp1, dp2);
            // dp.AddToMenu(dp1)
            s3.AddItem(dp2)


            for (let k = 0; k < 3; k++) {
                const l = Create_widget_label(_, 'l' + j, _, _, _, YELLOWL[6], _, [5, 5]);
                Widget_gfx_ready_enable_default(l, rcorners);
                dp2.AddToMenu(l)
            }

        }


    }

    // dp.gfx_ctx_flags |= GFX_CTX_FLAGS.FROM_PARENT_ASC | GFX_CTX_FLAGS.PRIVATE;
    // dp.gfx_ctx_flags |= GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.PRIVATE;
    // dp.GfxCtxSetFlag(dp.gfx_ctx_flags, dp.mesh_bufferidx);

    // // s.options = SECTION.VERTICAL|SECTION.FIXED_H
    s.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT
    s.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);

    s.Calc_no_gfx_update();

    s.Render();
    Root_group_activate_all_vbs_in_renderqueue(s.root_bufferidx);

    Construct_listen_events_from_mesh_tree(s);
    Construct_listen_events_relations_from_mesh_tree(s);

    s.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, s.gfx.vb.groupidx);

    View_build_group_from_root_mesh(s);


    for (let i = 0; i < scrolled_meshes_buffer.length; i++) {

        const scroller_component1 = Components_create_scroller_component(_, scrolled_meshes_buffer[i].geom.dim[1], scrolled_meshes_buffer[i], scrolled_meshes_buffer[i].GetPosY());
        Scoller_component_gengfx_and_render(scroller_component1, scrolled_meshes_buffer[i]);
        Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(scrolled_meshes_buffer[i].root_posidx, scroller_component1.root_posidx);
        scrolled_meshes_buffer[i].AddChildScrollerIdx(scrolled_meshes_buffer[i].scroller_comp_idx);
        Listeners_set_priority(E.C, scroller_component1.listeners)
    }

}









/**************************************************************************************************************************************/
// Widget Section Tests

function TestSections1() {

    const marg = [10, 10];

    // const pos = [VIEWPORT.WIDTH/2, VIEWPORT.HEIGHT/2, 0];
    const pos = [0, 0, 0];

    const root = Create_widget_section(Style_section_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, options:SECTION.VERTICAL, pad:marg, pos:pos, dim:[0, 0], col:TRANSPARENCY(BLUEL[5], 1)}));
    root.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    root.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    root.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    root.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    root.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    root.SetName('root_blue');

    { // Test 1
        const s1 = Sections4(_, SECTION.HORIZONTAL, pos);
        s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        root.AddItem(s1);
        const s2 = Sections4(_, SECTION.HORIZONTAL, pos);
        s2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        root.AddItem(s2);
    }

    { // Test 2
        const s1 = Sections2(_, SECTION.VERTICAL, pos);
        s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        root.AddItem(s1);

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

    root.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, root.gfx.vb.groupidx);

    Root_group_activate_all_vbs_in_renderqueue(root.root_bufferidx);
    Construct_listen_events_from_mesh_tree(root)
    Construct_listen_events_relations_from_mesh_tree(root);
}
let grey_cnt = 0;
let green_cnt = 0;
let orange_cnt = 0;
function Sections2(is_root, align) {

    const tr = .7;
    const marg = [10, 10];
    const dim = [10, 10];

    // const grey = Create_widget_section(is_root, align, marg, [0, 0, 0], dim, TRANSPARENCY(GREY[0], tr));
    const grey = Create_widget_section(Style_section_default_properties({is_root:is_root, options:align, pad:marg, pos:[0,0,0], dim:dim, col:TRANSPARENCY(GREY[0], tr)}));
    // grey.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    // grey.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    // grey.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    grey.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    grey.SetName(`grey${grey_cnt++}`);
    
    // const green = Create_widget_section(_, SECTION.VERTICAL, marg, [0, 0, 0], dim, TRANSPARENCY(GREEN[3], tr));
    const green = Create_widget_section(Style_section_default_properties({is_root:_, options:SECTION.VERTICAL, pad:marg, pos:[0,0,0], dim:dim, col:TRANSPARENCY(GREEN[3], tr)}));
    // green.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    // green.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    // green.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    green.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    green.SetName(`green${green_cnt++}`);
    grey.AddItem(green);
    
    // const orange = Create_widget_section(_, SECTION.VERTICAL, marg, [0, 0, 0], dim, TRANSPARENCY(ORANGER[7], tr));
    const orange = Create_widget_section(Style_section_default_properties({is_root:_, options:SECTION.VERTICAL, pad:marg, pos:[0,0,0], dim:dim, col:TRANSPARENCY(ORANGER[7], tr)}));
    // orange.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    // orange.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    // orange.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    orange.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    orange.SetName(`orange${orange_cnt++}`);
    green.AddItem(orange);

    return grey;
}
function Sections4(is_root, align) {

    const tr = 1.;

    // const blu = Create_widget_section(is_root, align, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
    const blu = Create_widget_section(Style_section_default_properties({is_root:is_root, options:align, pad:[15,15], pos:[0,0,0], dim:[20, 20], col:TRANSPARENCY(GREY[1], tr)}));
    blu.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    blu.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    blu.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    blu.SetName('grey');
    
    // const red = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(REDL[7], tr));
    const red = Create_widget_section(Style_section_default_properties({is_root:_, options:SECTION.VERTICAL, pad:[15,15], pos:[0,0,0], dim:[20, 20], col:TRANSPARENCY(REDL[1], tr)}));
    red.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    red.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    red.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    red.SetName('red');
    blu.AddItem(red);
    // const green = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(GREEN[6], tr));
    const green = Create_widget_section(Style_section_default_properties({is_root:_, options:SECTION.VERTICAL, pad:[15,15], pos:[0,0,0], dim:[20, 20], col:TRANSPARENCY(GREEN[6], tr)}));
    green.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    green.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    green.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
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


function Help() {


    const flags = (SECTION.ITEM_FIT);

    //options, margin, pos, dim, col, name
    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [20, 20], [200, 5, 0], [0, 0], TRANSPARENCY(GREY[1], .8));
    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.SetName('Help section')

    // scene.StoreMesh(section)
    const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[3], .6));
    s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    s1.SetName('Help section 2')
    // s1.options = SECTION.EXPAND | SECTION.VERTICAL;

    let msgs = [];
    for (let i = 0; i < DEBUG_PRINT_KEYS.length; i++) {

        msgs[i] = '\"' + DEBUG_PRINT_KEYS[i].key + '\": ' + DEBUG_PRINT_KEYS[i].discr

        const label = Create_widget_label(_, msgs[i], ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 7, TRANSPARENCY(YELLOWR[7], 1.), BLACK, [7, 3], .5, [0, 4, 3]);
        label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
        label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 8);
        label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)

        s1.AddItem(label)

    }


    // const minimizer = Create_widget_minimize_btn(_, section, section.geom.pos, 12);
    // minimizer.SetName('minimi')
    // section.AddItem(minimizer);

    section.AddItem(s1)


    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

    section.options = SECTION.EXPAND | SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT
    // section.options = SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT


    section.Calc_no_gfx_update();


    section.Render()

    section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

    View_build_group_from_root_mesh(section)


    Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
    Construct_listen_events_from_mesh_tree(section)
    Construct_listen_events_relations_from_mesh_tree(section);


    // Create_root_widget_buffer(section);
    // Create_widget_tree_from_root(section);
    // Widget_root_batch_create_from_root_children(section.root_bufferidx)


    // const scroller_component = Components_create_scroller_component(_, 100, section, section.GetPosY(),);
    // Scoller_component_gengfx_and_render(scroller_component, section);
    // Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(section.root_posidx, scroller_component.root_posidx)
    // section.AddChildScrollerIdx(section.scroller_comp_idx);
    const scroller_component = Components_create_scroller_component(_, 400, s1, s1.GetPosY(),);
    Scoller_component_gengfx_and_render(scroller_component, s1);
    Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(s1.root_posidx, scroller_component.root_posidx)
    section.AddChildScrollerIdx(s1.scroller_comp_idx);
    Scroller_component_calculate_handle_pos_dim(s1, scroller_component);
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
    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [15, 10], pos, [0, 0], TRANSPARENCY(GREY[1], .8), 'MeshInfoUiTip');
    // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [15, 10], pos, [100, 100], GREY[1], 'MeshInfoUiTip');
    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    // section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

    /********************************************************************************************************************************************************/
    // Menu bar and Minimizer
    const menu = Create_widget_menubar(_, pos, _, TRANSPARENCY(GREEN[4], .7), WHITE, 'Info tip', [10, 6],);
    // const menu = Create_widget_menubar(_, [80, 200, 1], [30,10], GREEN[9], WHITE, 'Info tip', [10, 6],);
    menu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    menu.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    menu.AddMinimizeButton(_, section);
    menu.options = SECTION.HORIZONTAL | SECTION.INHERIT;
    section.AddItem(menu);

    // /********************************************************************************************************************************************************/
    // // All the info text                            _, 'Meshes:', align, [0, 0, DEBUG_INFO.UI_STATS.POS[2] + 1], fontsize, GREY[7], .5, pad1
    // const infomesh = Create_widget_multi_text(_, 'Mesh name 000000000000', ALIGN.VERTICAL, [420, 15, 100], fontsize, GREEN[7], pad, .4);
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
    // TEMP_TEST_PERFORMANE_COUNTERS.MISC_IDX = infomesh.CreateNewText('GENERIC DEBUG: 00000000000000000000', fontsize, BLUE_10_120_220, pad, .9);
    // section.geom.pos[0] = VIEWPORT.RIGHT - infomesh.GetMaxWidth() * 2 - 30;
    // section.geom.pos[1] = VIEWPORT.TOP;

    // infomesh.Align_pre(infomesh, ALIGN.VERTICAL)


    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    section.options = SECTION.VERTICAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.EXPAND | SECTION.RESIZE_PARENT;
    // section.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
    section.Calc_no_gfx_update();
    section.Render();
    Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
    Construct_listen_events_from_mesh_tree(section)
    Construct_listen_events_relations_from_mesh_tree(section);
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
        const mouse_pos = Mouse_get_pos();
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
            mat.EnableGfx(MAT_ENABLE.ATTR_VERTEX_COLOR, {
                color: [
                    0.9, 0.0, 0.0, .4,
                    0.0, 0.9, 0.1, .4,
                    0.0, 0.0, 0.9, .4,
                    0.9, 0.0, 0.9, .4
                ]
            });
            const cube = new Mesh(geom, mat);
            scene.AddMesh(cube);

            console.log('cube', SID.GetTypeToString(cube.sid), cube.sid)
            cube.type |= geom.type;
            cube.type |= mat.type;
        }
        {
            const geom = new CubeGeometry([240, 450, -1], [100, 100, 100], [1, 1, 1]);
            const mat = new Material_TEMP_fromBufferFor3D(WHITE);
            mat.EnableGfx(MAT_ENABLE.ATTR_VERTEX_COLOR, {
                color: [
                    1.0, 1.0, 0.0, .4,
                    0.0, 0.7, 0.4, .4,
                    0.0, 1.0, 0.0, .4,
                    1.0, 0.0, 1.0, .4,
                ]
            });
            const cube2 = new Mesh(geom, mat);
            scene.AddMesh(cube2);
            console.log('cube2:', SID.GetTypeToString(cube2.sid), cube2.sid)
            cube2.type |= geom.type;
            cube2.type |= mat.type;
        }
        {
            const geom = new CubeGeometry([400, 450, -1], [100, 100, 100], [1, 1, 1]);
            const mat = new Material_TEMP_fromBufferFor3D(WHITE);
            mat.EnableGfx(MAT_ENABLE.ATTR_VERTEX_COLOR, {
                color: [
                    0.9, 0.0, 0.0, .4,
                    0.0, 0.9, 0.1, .4,
                    0.0, 0.0, 0.9, .4,
                    0.9, 0.0, 0.9, .4
                ]
            });
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
    const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [0, VIEWPORT.HEIGHT - dim * 2, 0], [75 * 1, 40 * 1], YELLOW[9], 'TEST-SHADERS',);
    rect.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    rect.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

    rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
    rect.EnableGfx(MESH_ENABLE.GFX.TEST_SHADERS_1);
    // rect.EnableGfx(MESH_ENABLE.GFX.TEST_SHADERS_2);

    // Use u_time to quicly establish a uniform for the testing
    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

    // Render
    rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

    rect.Render();
    Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);


    rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
    rect.GfxUniformSetAndUpdate('u_generic_vec3', [4, 1, 1]);

    Construct_listen_events_from_mesh_tree(rect);
    Construct_listen_events_relations_from_mesh_tree(rect);



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
    const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [0, VIEWPORT.HEIGHT - dim * 2, 0], [dim, dim], BLACK, 'TEST-SHADERS',);
    // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], BLUEL[9], 'TEST-SHADERS',);
    rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

    rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
    rect.EnableGfx(MESH_ENABLE.GFX.TEST_SHADERS_3);
    // rect.EnableGfx(MESH_ENABLE.GFX.TEST_SHADERS_2);

    // Use u_time to quicly establish a uniform for the testing
    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

    // Render
    rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

    rect.Render();
    Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);


    rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
    rect.GfxUniformSetAndUpdate('u_generic_vec3', [4, 1, 1]);

    Construct_listen_events_from_mesh_tree(rect);
    Construct_listen_events_relations_from_mesh_tree(rect);



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
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [0, VIEWPORT.HEIGHT-dim*2, 0], [dim, dim], BLUEL[9], 'TEST-SHADERS',);
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], YELLOW[9], 'TEST-SHADERS',);
        const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], PURPLE[1], 'TEST-SHADERS',);
        rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        // rect.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.TEST_SHADERS_2);

        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        rect.Render();
        Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);


        rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
        rect.GfxUniformSetAndUpdate('u_generic_vec3', [4, 1]);

        Construct_listen_events_from_mesh_tree(rect);
        Construct_listen_events_relations_from_mesh_tree(rect);

        rect1 = rect;

    }
    let rect2 = null;
    {
        // const dim=300
        const dim = 180
        const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 400, 0], [100, 70], PURPLE[1], 'TEST-SHADERS',);
        rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        // rect.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.TEST_SHADERS_2);

        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        rect.Render();
        Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);


        rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
        rect.GfxUniformSetAndUpdate('u_generic_vec3', [4, 1]);

        Construct_listen_events_from_mesh_tree(rect);
        Construct_listen_events_relations_from_mesh_tree(rect);

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
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], PURPLE[1], 'TEST-SHADERS',);
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], PURPLE[9], 'TEST-SHADERS',);
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], WHITE, 'TEST-SHADERS',);
        const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 300, 0], [dim, dim], BLUEL[9], 'TEST-SHADERS',);
        rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
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
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        rect.Render();
        Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);


        rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
        // rect.GfxUniformSetAndUpdate('u_generic_vec3', [4, 1]);
        // rect.GfxUniformSetAndUpdate('u_generic_controls', [1, 1, 1, 1, 1, 1, 1, 1, 1]);
        rect.GfxUniformSetAndUpdate('u_generic_controls', [1, 1, 1, 1, 1, 1]);

        Construct_listen_events_from_mesh_tree(rect);
        Construct_listen_events_relations_from_mesh_tree(rect);

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
function Test_shaders_inner_shadow_rhomboid_effect() { // Shaders Tests

    const dim = 200
    // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [0, VIEWPORT.HEIGHT - dim * 2, 0], [dim, dim], BLACK, 'TEST-SHADERS',);
    const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [0, VIEWPORT.HEIGHT - dim * 2, 0], [75 * 1, 40 * 1], YELLOW[9], 'TEST-SHADERS',);
    // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [0, VIEWPORT.HEIGHT - dim * 2, 0], [75*5, 40*3], YELLOW[9], 'TEST-SHADERS',);
    // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [0, VIEWPORT.HEIGHT - dim * 2, 0], [50*7, 50*2], YELLOW[9], 'TEST-SHADERS',);
    // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [0, VIEWPORT.HEIGHT - dim * 2, 0], [50*4, 50*2], YELLOW[9], 'TEST-SHADERS',);
    // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [20, VIEWPORT.HEIGHT -( dim * 2 + 20), 0], [50*8, 50*4], YELLOW[9], 'TEST-SHADERS',);
    // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [20, VIEWPORT.HEIGHT -( dim * 2 + 20), 0], [50*6, 50*4], YELLOW[9], 'TEST-SHADERS',);
    // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [0, VIEWPORT.HEIGHT - dim * 2, 0], [55*5, 55*5], YELLOW[9], 'TEST-SHADERS',);
    // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [0, VIEWPORT.HEIGHT - dim * 2, 0], [50*2, 50*4], YELLOW[9], 'TEST-SHADERS',);


    rect.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    rect.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

    // Blending mode
    // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_MIX, .0);
    // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_MASK);
    // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_SUBTRACT); // 

    // rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
    rect.EnableGfx(MESH_ENABLE.GFX.FN_INNER_SHADOW);

    // Use u_time to quicly establish a uniform for the testing
    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

    // Render
    rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

    rect.Render();
    Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);


    rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
    rect.GfxUniformSetAndUpdate('u_generic_vec3', [4, 1, 1]);

    Construct_listen_events_from_mesh_tree(rect);
    Construct_listen_events_relations_from_mesh_tree(rect);



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
function Test_shaders_Shadow_specular() { // Shaders Tests

    let rect1 = null;
    {
        // const dim=300
        const dim = 80
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], PURPLE[1], 'TEST-SHADERS',);
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], PURPLE[9], 'TEST-SHADERS',);
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], WHITE, 'TEST-SHADERS',);
        const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 300, 0], [dim, dim], BLUEL[9], 'TEST-SHADERS',);
        rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        // rect.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME);
        rect.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        // rect.EnableGfx(MESH_ENABLE.GFX.TEST_SHADERS_4);
        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_CIRCLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SPECULAR_CIRCLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);


        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 6);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        rect.Render();
        Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);


        rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
        rect.GfxUniformSetAndUpdate('u_generic_controls', [1, 1, 1, 1, 1, 1]);

        Construct_listen_events_from_mesh_tree(rect);
        Construct_listen_events_relations_from_mesh_tree(rect);

        rect1 = rect;

    }


    { // Controls
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
            const slider = CreateSlider(_, 10, ypos, .0, 'Shadow-Range');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh1 = params.clbk_params.target_mesh1;
                target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 1);

            }, params,
            );
        } ypos += height;
        { // Slider: unif 3
            const slider = CreateSlider(_, 10, ypos, .21, 'Shadow-Darkness');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh1 = params.clbk_params.target_mesh1;
                target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 2);

            }, params,
            );
        } ypos += height;
        { // Slider: unif 4
            const slider = CreateSlider(_, 10, ypos, 1., 'Specular-Ineer Feather');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh1 = params.clbk_params.target_mesh1;
                target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 3);

            }, params,
            );
        } ypos += height;
        { // Slider: unif 5
            const slider = CreateSlider(_, 10, ypos, .82, 'Specular-Outer Feather');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh1 = params.clbk_params.target_mesh1;
                target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 4);

            }, params,
            );
        } ypos += height;
        { // Slider: unif 6
            const slider = CreateSlider(_, 10, ypos, .12, 'Specular-Intensity');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh1 = params.clbk_params.target_mesh1;
                target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 5);

            }, params,
            );
        } ypos += height;
    }


}
function Test_shaders_bubble_flare() { // Shaders Tests

    let rect1 = null;
    {
        // const dim=300
        // const dim = 150
        const dim = 100
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], PURPLE[1], 'TEST-SHADERS',);
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 300, 0], [dim, dim], PURPLE[9], 'TEST-SHADERS',);
        const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 300, 0], [dim, dim], WHITE, 'TEST-SHADERS',);
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 300, 0], [dim, 200], WHITE, 'TEST-SHADERS',);
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], BLUEL[9], 'TEST-SHADERS',);
        rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        // rect.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dim);
        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME);

        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SIMPLE_GLOW, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.FLARE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.FLARE, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.BUBBLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 6);
        rect.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);


        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        rect.Render();
        Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);


        rect.GfxUniformSetAndUpdate('u_scale2', [.5, 1,]);
        rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
        // rect.GfxUniformSetAndUpdate('u_generic_vec3', [4, 1]);
        rect.GfxUniformSetAndUpdate('u_generic_controls', [1, .04, .45, 1, 1, 1, 1, 1, 1]);
        // rect.GfxUniformSetAndUpdate('u_generic_controls', [1.0, 0.02, 1]);
        // rect.GfxUniformSetAndUpdate('u_generic_controls', [1.0, 0.02, 1, 1, 1, 1]);

        Construct_listen_events_from_mesh_tree(rect);
        Construct_listen_events_relations_from_mesh_tree(rect);

        rect1 = rect;

    }


    const params = {
        target_mesh1: rect1,
    };

    let ypos = 20;
    const height = 45;

    { // Slider: unif 1
        const slider = CreateSlider(_, 10, ypos, .59, 'inner feather');

        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh1 = params.clbk_params.target_mesh1;
            target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 0);

        }, params,
        );
    } ypos += height;
    { // Slider: unif 2
        const slider = CreateSlider(_, 10, ypos, .06, 'outer feather');

        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh1 = params.clbk_params.target_mesh1;
            target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 1);

        }, params,
        );
    } ypos += height;
    { // Slider: unif 3
        const slider = CreateSlider(_, 10, ypos, .28, '...');

        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh1 = params.clbk_params.target_mesh1;
            target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 2);

        }, params,
        );
    } ypos += height;
    { // Slider: unif 4
        const slider = CreateSlider(_, 10, ypos, 1., 'Specular-Ineer Feather');

        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh1 = params.clbk_params.target_mesh1;
            target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 3);

        }, params,
        );
    } ypos += height;
    { // Slider: unif 5
        const slider = CreateSlider(_, 10, ypos, 1., 'Specular-Outer Feather');

        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh1 = params.clbk_params.target_mesh1;
            target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 4);

        }, params,
        );
    } ypos += height;
    { // Slider: unif 6
        const slider = CreateSlider(_, 10, ypos, 1., 'Specular-Intensity');

        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh1 = params.clbk_params.target_mesh1;
            target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 5);

        }, params,
        );
    } ypos += height;
    { // Slider: unif 6
        const slider = CreateSlider(_, 10, ypos, .5, 'U-Scale');

        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh1 = params.clbk_params.target_mesh1;
            const val_idx = 0;
            // Find the ubidx
            const ubidx = Mesh_get_uniform_ubidx_from_name(target_mesh1.uniforms, 'u_scale2');
            Vertex_buffer_set_and_update_uniform(target_mesh1.gfx.vb.groupidx, ubidx, slider_val, val_idx);

        }, params,
        );
    } ypos += height;


}



/*******************************************************************************************************************************************************/
// Test Shader Noises
function Test_shaders_operations_sdf_rect() { // Shaders Tests

    let rect1 = null;
    {
        const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [30, 250, 0], [200, 100], BLUEL[9], 'TEST-SHADERS',);
        rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 60);

        // rect.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 4);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        rect.Render();
        Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);

        rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
        rect.GfxUniformSetAndUpdate('u_scale2', [.5, 1]);
        rect.GfxUniformSetAndUpdate('u_generic_controls', [.5, .3, 1.]);

        Construct_listen_events_from_mesh_tree(rect);
        Construct_listen_events_relations_from_mesh_tree(rect);

        rect1 = rect;

    }
    let rect2 = null;
    {
        const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [30, 450 + 5, 0], [400, 100], BLUEL[9], 'TEST-SHADERS',);
        rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 100);

        rect.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 4);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        rect.Render();
        Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);

        rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
        rect.GfxUniformSetAndUpdate('u_scale2', [.5, 1]);
        rect.GfxUniformSetAndUpdate('u_generic_controls', [.5, 0., 1., 1.]);

        Construct_listen_events_from_mesh_tree(rect);
        Construct_listen_events_relations_from_mesh_tree(rect);

        rect2 = rect;

    }
    let rect3 = null;
    {
        const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [520, 140, 0], [50, 150], BLUEL[9], 'TEST-SHADERS',);
        rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 100);

        rect.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 4);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        rect.Render();
        Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);

        rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
        rect.GfxUniformSetAndUpdate('u_scale2', [.5, 1]);
        rect.GfxUniformSetAndUpdate('u_generic_controls', [.5, 0., 1., 1.]);

        Construct_listen_events_from_mesh_tree(rect);
        Construct_listen_events_relations_from_mesh_tree(rect);

        rect3 = rect;

    }
    let rect4 = null;
    {
        const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [630, 240, 0], [100, 100], BLUEL[9], 'TEST-SHADERS',);
        rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 100);

        rect.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 6);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        rect.Render();
        Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);

        rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
        rect.GfxUniformSetAndUpdate('u_scale2', [1., 1]);
        rect.GfxUniformSetAndUpdate('u_generic_controls', [.5, 0., 1., 1.]);

        Construct_listen_events_from_mesh_tree(rect);
        Construct_listen_events_relations_from_mesh_tree(rect);

        rect4 = rect;

    }


    const params = {
        target_mesh1: rect1,
        target_mesh2: rect2,
        target_mesh3: rect3,
        target_mesh4: rect4,
    };

    let ypos = 20;
    const height = 45;

    {
        { // Slider: unif 1
            const slider = CreateSlider(_, 10, ypos, 1., 'Scale');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                params.clbk_params.target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 0);
                params.clbk_params.target_mesh2.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 0);
                params.clbk_params.target_mesh3.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 0);
                params.clbk_params.target_mesh4.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 0);

            }, params,
            );
        } ypos += height;
        { // Slider: unif 2
            const slider = CreateSlider(_, 10, ypos, 1., 'Dim Scale');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                params.clbk_params.target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 1);
                params.clbk_params.target_mesh2.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 1);
                params.clbk_params.target_mesh3.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 1);
                params.clbk_params.target_mesh4.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 1);

            }, params,
            );
        } ypos += height;
        { // Slider: unif 3
            const slider = CreateSlider(_, 10, ypos, 1.0, 'inner');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                params.clbk_params.target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 2);
                params.clbk_params.target_mesh2.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 2);
                params.clbk_params.target_mesh3.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 2);
                params.clbk_params.target_mesh4.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 2);

            }, params,
            );
        } ypos += height;
        { // Slider: unif 4
            const slider = CreateSlider(_, 10, ypos, .98, '3');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                params.clbk_params.target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 3);
                params.clbk_params.target_mesh2.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 3);
                params.clbk_params.target_mesh3.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 3);
                params.clbk_params.target_mesh4.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 3);

            }, params,
            );
        } ypos += height;
        { // Slider: unif 5
            const slider = CreateSlider(_, 10, ypos, .98, '4');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                params.clbk_params.target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 4);
                params.clbk_params.target_mesh2.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 4);
                params.clbk_params.target_mesh3.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 4);
                params.clbk_params.target_mesh4.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 4);

            }, params,
            );
        } ypos += height;
        // { // Slider: unif 6
        //     const slider = CreateSlider(_, 10, ypos, .3, '..');

        //     // Connect sliders to gfx program uniforms 
        //     Slider_connect(slider, (params, slider_val) => {

        //         const target_mesh1 = params.clbk_params.target_mesh1;
        //         params.clbk_params.target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 5);

        //     }, params,
        //     );
        // } ypos += height;

    }


}
function Shader_color_functions_worley_1_noise() { // Shaders Tests

    {
        // const dim=300
        const dim = 300
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [0, VIEWPORT.HEIGHT-dim*2, 0], [dim, dim], BLUEL[9], 'TEST-SHADERS',);
        const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], BLUEL[9], 'SHADER_FN:WORLEY-NOISE',);
        rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_WORLEY);

        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        rect.Render();
        Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);


        rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
        rect.GfxUniformSetAndUpdate('u_generic_vec3', [4, 1]);

        Construct_listen_events_from_mesh_tree(rect);
        Construct_listen_events_relations_from_mesh_tree(rect);



        { // Slider: unif 1
            const slider = CreateSlider(_, 10, 20, .5, 'Smooth');

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
            const slider = CreateSlider(_, 10, 60, 1., 'Range');

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
        { // Slider: unif 3
            const slider = CreateSlider(_, 10, 100, .18, '...');

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
}
function Shader_color_functions_worley_2_noise() { // Shaders Tests

    {
        // const dim=300
        const dim = 300
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [0, VIEWPORT.HEIGHT-dim*2, 0], [dim, dim], BLUEL[9], 'TEST-SHADERS',);
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], BLUEL[9], 'SHADER_FN:WORLEY-2-NOISE',);
        const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], BLUEL[9], 'SHADER_FN:WORLEY-2-NOISE',);
        rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_WORLEY, 2);

        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        rect.Render();
        Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);


        rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
        rect.GfxUniformSetAndUpdate('u_generic_vec3', [4, 1]);

        Construct_listen_events_from_mesh_tree(rect);
        Construct_listen_events_relations_from_mesh_tree(rect);



        { // Slider: unif 1
            const slider = CreateSlider(_, 10, 20, 1., 'Smooth');

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
            const slider = CreateSlider(_, 10, 60, .7, 'Range');

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
        { // Slider: unif 3
            const slider = CreateSlider(_, 10, 100, .18, '...');

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
}
function Shader_color_functions_worley_3_types_noise() { // Shaders Tests

    {
        // const dim=300
        const dim = 300
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [0, VIEWPORT.HEIGHT-dim*2, 0], [dim, dim], BLUEL[9], 'TEST-SHADERS',);
        const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], BLUEL[9], 'SHADER_FN:WORLEY-2-NOISE',);
        rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_WORLEY, 3);

        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        rect.Render();
        Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);


        rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
        rect.GfxUniformSetAndUpdate('u_generic_vec3', [4, 1]);

        Construct_listen_events_from_mesh_tree(rect);
        Construct_listen_events_relations_from_mesh_tree(rect);



        { // Slider: unif 1
            const slider = CreateSlider(_, 10, 20, 1., 'Time');

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
            const slider = CreateSlider(_, 10, 60, .0, 'Mix Type 1-2');

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
        { // Slider: unif 3
            const slider = CreateSlider(_, 10, 100, .0, 'Mix type 3');

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
}
function Shader_color_functions_voronoi_1_noise() { // Shaders Tests

    {
        // const dim=300
        const dim = 300
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [0, VIEWPORT.HEIGHT-dim*2, 0], [dim, dim], BLUEL[9], 'TEST-SHADERS',);
        const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], BLUEL[9], 'SHADER_FN:WORLEY-2-NOISE',);
        rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        // rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_WORLEY);
        rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_VORONOI, 1);

        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        rect.Render();
        Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);


        rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
        rect.GfxUniformSetAndUpdate('u_generic_vec3', [4, 1]);

        Construct_listen_events_from_mesh_tree(rect);
        Construct_listen_events_relations_from_mesh_tree(rect);



        { // Slider: unif 1
            const slider = CreateSlider(_, 10, 20, .5, 'Smooth');

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
            const slider = CreateSlider(_, 10, 60, 1., 'Range');

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
        { // Slider: unif 3
            const slider = CreateSlider(_, 10, 100, .18, '...');

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
}
function Shader_color_functions_voronoi_2_noise() { // Shaders Tests

    {
        // const dim=300
        const dim = 300
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [0, VIEWPORT.HEIGHT-dim*2, 0], [dim, dim], BLUEL[9], 'TEST-SHADERS',);
        const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], BLUEL[9], 'SHADER_FN:WORLEY-2-NOISE',);
        rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        // rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_WORLEY);
        rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_VORONOI, 2);

        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        rect.Render();
        Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);


        rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
        rect.GfxUniformSetAndUpdate('u_generic_vec3', [4, 1]);

        Construct_listen_events_from_mesh_tree(rect);
        Construct_listen_events_relations_from_mesh_tree(rect);



        { // Slider: unif 1
            const slider = CreateSlider(_, 10, 20, .5, 'Scale');

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
            const slider = CreateSlider(_, 10, 60, .02, 'Isolines Number');

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
        { // Slider: unif 3
            const slider = CreateSlider(_, 10, 100, .18, 'Time');

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
}
function Shader_color_functions_blend_simple_noise_with_voronoi() { // Shaders Tests

    {
        const dim = 200
        const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [10, 200, 0], [dim, dim], YELLOW[7], 'SHADER_FN:WORLEY-2-NOISE',);
        rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);

        // rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_WORLEY, 1);
        // rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_WORLEY, 2);
        rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_WORLEY, 3);
        // rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_VORONOI, 1);
        // rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_VORONOI, 2);

        // rect.EnableGfx(MESH_ENABLE.GFX.FN_INNER_SHADOW);

        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME, 0);
        rect.EnableGfx(MESH_ENABLE.GFX.FX_NOISE, 2);
        rect.EnableGfxUniforms({ fx: SID.FX.FS_NOISE_2, }, 'u_noise_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_LIGHTEN);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_DIVIDE);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_SUBTRACT);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_DARKEN);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_COLOR_BURN);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_COLOR_DODGE);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_SCREEN);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_OVERLAY);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_MIX, .5);
        rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_MASK);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_ALPHA);


        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        rect.Render();
        Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);

        Construct_listen_events_from_mesh_tree(rect);
        Construct_listen_events_relations_from_mesh_tree(rect);


        rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
        // rect.GfxUniformSetAndUpdate('u_generic_vec3', [.0, .02, .1]);
        rect.GfxUniformSetAndUpdate('u_noise_params', [.0, 1, .13]);




        { // Slider: unif 1
            const slider = CreateSlider(_, 10, 20, .3, 'Scale');

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
            const slider = CreateSlider(_, 10, 60, .4, 'Isolines Number');

            const params = {
                target_mesh: rect,
            };
            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh = params.clbk_params.target_mesh;
                const val = Linear_interpolation(.2, 10, slider_val);

                target_mesh.GfxUniformSetAndUpdate('u_generic_vec3', val, 1);

            }, params,
            );
        }
        { // Slider: unif 3
            const slider = CreateSlider(_, 10, 100, .18, 'Time');

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
        { // Slider: unif 3
            const slider = CreateSlider(_, 10, 150, .18, 'u_noise_params-scale');

            const params = {
                target_mesh: rect,
            };
            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh = params.clbk_params.target_mesh;
                const val = Linear_interpolation(.01, .15, slider_val);
                target_mesh.GfxUniformSetAndUpdate('u_noise_params', val, 2);

            }, params,
            );
        }

    }
}
function Shader_color_functions_noise_test() { // Shaders Tests

    {
        // const dim=300
        const dim = 200
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [0, VIEWPORT.HEIGHT-dim*2, 0], [dim, dim], BLUEL[9], 'TEST-SHADERS',);
        const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [10, 200, 0], [dim, dim], YELLOW[7], 'SHADER_FN:WORLEY-2-NOISE',);
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [120, 420, 0], [50, 30], BLUEL[9], 'SHADER_FN:WORLEY-2-NOISE',);
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [120, 420, 0], [80, 60], BLUEL[9], 'SHADER_FN:WORLEY-2-NOISE',);
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [120, 420, 0], [180, 120], BLUEL[9], 'SHADER_FN:WORLEY-2-NOISE',);
        rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);

        // rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_WORLEY, 1);
        // rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_WORLEY, 2);
        // rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_WORLEY, 3);
        // rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_VORONOI, 1);
        // rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_VORONOI, 2);

        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME, 0);
        // rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.FX_NOISE, 2);
        rect.EnableGfxUniforms({ fx: SID.FX.FS_NOISE_2, }, 'u_noise_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_LIGHTEN);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_DIVIDE);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_SUBTRACT);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_DARKEN);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_COLOR_BURN);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_COLOR_DODGE);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_SCREEN);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_OVERLAY);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_MIX, .5);
        rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_MASK);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_ALPHA);


        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        rect.Render();
        Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);

        Construct_listen_events_from_mesh_tree(rect);
        Construct_listen_events_relations_from_mesh_tree(rect);


        rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
        rect.GfxUniformSetAndUpdate('u_generic_vec3', [.0, .02, .1]);
        // rect.GfxUniformSetAndUpdate('u_generic_vec3', [1.0, .02, .0]);

        // rect.GfxUniformSetAndUpdate('u_noise_params', [.1, 0, .002]);
        // rect.GfxUniformSetAndUpdate('u_noise_params', [.0, 1, .01]);
        // rect.GfxUniformSetAndUpdate('u_noise_params', [.0, 1, .025]);
        // rect.GfxUniformSetAndUpdate('u_noise_params', [.0, 1, .04]);
        rect.GfxUniformSetAndUpdate('u_noise_params', [.0, 1, .13, 1]);




        { // Slider: unif 1
            const slider = CreateSlider(_, 10, 20, .3, 'Scale');

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
            const slider = CreateSlider(_, 10, 60, .4, 'Isolines Number');

            const params = {
                target_mesh: rect,
            };
            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh = params.clbk_params.target_mesh;
                const val = Linear_interpolation(.2, 10, slider_val);

                target_mesh.GfxUniformSetAndUpdate('u_generic_vec3', val, 1);

            }, params,
            );
        }
        { // Slider: unif 3
            const slider = CreateSlider(_, 10, 100, .18, 'Time');

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
        { // Slider: unif 3
            const slider = CreateSlider(_, 10, 150, .18, 'u_noise_params-scale');

            const params = {
                target_mesh: rect,
            };
            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh = params.clbk_params.target_mesh;
                const val = Linear_interpolation(.01, .15, slider_val);
                target_mesh.GfxUniformSetAndUpdate('u_noise_params', val, 2);

            }, params,
            );
        }

    }
}
function Shader_color_functions_glow_sphere() { // Shaders Tests

    {
        // const dim=300
        const dim = 100
        const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [0, VIEWPORT.HEIGHT / 2, 0], [dim, dim], BLUEL[9], 'SHADER_FN:GLOW-SPHERE',);
        rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_MIX);
        // rect.EnableGfx(MESH_ENABLE.GFX.FN_GLOW_SPHERE);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.FLARE, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SIMPLE_GLOW2, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);

        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 6);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        rect.Render();
        Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);


        rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
        rect.GfxUniformSetAndUpdate('u_generic_controls', [4, 1, 0, 1, 1, 1]);

        Construct_listen_events_from_mesh_tree(rect);
        Construct_listen_events_relations_from_mesh_tree(rect);



        { // Slider: unif 1
            const slider = CreateSlider(_, 10, 20, 1., 'Smooth');

            const params = {
                target_mesh: rect,
            };
            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh = params.clbk_params.target_mesh;
                target_mesh.GfxUniformSetAndUpdate('u_generic_controls', slider_val * 2, 0);

            }, params,
            );
        }
        { // Slider: unif 2
            const slider = CreateSlider(_, 10, 60, 1., 'Range');

            const params = {
                target_mesh: rect,
            };
            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh = params.clbk_params.target_mesh;
                target_mesh.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 1);

            }, params,
            );
        }
        { // Slider: unif 3
            const slider = CreateSlider(_, 10, 100, .18, '...');

            const params = {
                target_mesh: rect,
            };
            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh = params.clbk_params.target_mesh;
                target_mesh.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 2);

            }, params,
            );
        }

    }
}
function Shader_color_functions_explosion_circle(x, y, w, h, color = BLUEL[9]) {



    let vb_groupidx = INT_NULL;
    let mesh1 = null;

    {
        const fx_meshidx = Effects_create_explosion_circle(200, 400, 200, 200, 0, 0, BLUEL[9], .4, .02)
        const fx = Effect_explosion_circle_get_mesh_byidx(fx_meshidx);
        mesh1 = fx.mesh;
        vb_groupidx = fx.mesh.gfx.vb.groupidx;
    }


    // FOR TESTING-DELETE
    const params_slider = {
        target_mesh: mesh1
    };
    {
        const slider_size = 150
        // Connect sliders to gfx program uniforms 
        { // Slider: unif 1
            const slider = Widget_ready_slider(ROOT_WIDGETS.CREATE_ROOT, 0, y, .5, 'UNUSED', slider_size);
            Slider_connect(slider, (params, slider_val) => {

                const val = Linear_interpolation(.01, .999, slider_val);
                const target_mesh = params.clbk_params.target_mesh;
                Gl_set_time(target_mesh.gfx, val); // Update attribute time

            }, params_slider,
            );
        }
        { // Slider: unif 1
            const slider = Widget_ready_slider(ROOT_WIDGETS.CREATE_ROOT, 0, y + 40, 1., 'Size(vector length)', slider_size);
            Slider_connect(slider, (params, slider_val) => {

                const val = Linear_interpolation(.0, 1., slider_val);
                const target_mesh = params.clbk_params.target_mesh;
                target_mesh.GfxUniformSetAndUpdate('u_generic_vec3', val, 0);

            }, params_slider,
            );
        }
        { // Slider: attr 1
            const slider = Widget_ready_slider(ROOT_WIDGETS.CREATE_ROOT, 0, y + 80, .0, 'Ring Diameter', slider_size);
            Slider_connect(slider, (params, slider_val) => {

                const val = Linear_interpolation(.0, 1, slider_val);
                const target_mesh = params.clbk_params.target_mesh;
                // target_mesh.GfxUniformSetAndUpdate('u_generic_vec3', val, 1);
                target_mesh.geom.generic.a = val;
                Gl_set_generic2(target_mesh.gfx, target_mesh.geom)

            }, params_slider,
            );
        }
        { // Slider: attr 2
            const slider = Widget_ready_slider(ROOT_WIDGETS.CREATE_ROOT, 0, y + 120, .02, 'Color Power', slider_size);
            Slider_connect(slider, (params, slider_val) => {

                const val = Linear_interpolation(.0, 1, slider_val);
                const target_mesh = params.clbk_params.target_mesh;
                // target_mesh.GfxUniformSetAndUpdate('u_generic_vec3', val, 2);
                target_mesh.geom.generic.b = val;
                Gl_set_generic2(target_mesh.gfx, target_mesh.geom,)

            }, params_slider,
            );
        }
        { // Slider: unif 2
            const slider = Widget_ready_slider(ROOT_WIDGETS.CREATE_ROOT, 0, y + 160, .98, '...', slider_size);
            Slider_connect(slider, (params, slider_val) => {

                const val = Linear_interpolation(.0, 1., slider_val);
                const target_mesh = params.clbk_params.target_mesh;
                target_mesh.GfxUniformSetAndUpdate('u_generic_vec3', val, 1);

            }, params_slider,
            );
        }
        { // Slider: unif 3
            const slider = Widget_ready_slider(ROOT_WIDGETS.CREATE_ROOT, 0, y + 200, 1., '...', slider_size);
            Slider_connect(slider, (params, slider_val) => {

                const val = Linear_interpolation(.0, 1., slider_val);
                const target_mesh = params.clbk_params.target_mesh;
                target_mesh.GfxUniformSetAndUpdate('u_generic_vec3', val, 2);

            }, params_slider,
            );
        }


        const params_explosion = {
            // explosion_meshes: [mesh1, mesh2,],
            explosion_meshes: [mesh1,],
        };
        // Set an interval timer to update the time attribute for the explosion effect
        // Time_intervals_create(1, 'Exposion Circle', TIME_INTERVAL_REPEAT_ALWAYS,
        //     (params) => {

        //         const len = params.params.explosion_meshes.length;
        //         for (let i = 0; i < len; i++) {

        //             const explosion = params.params.explosion_meshes[i];
        //             const time = Timer_get_global_timer_0_1();
        //             // Gl_set_time(explosion.gfx, time); // Update attribute time
        //             Gl_set_time(explosion.gfx, .01); // Update attribute time
        //         }
        //     },
        //     params_explosion,
        // );
    }

}
function Window_menu() {

    const pos = [100, 100, 0]

    // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [0, 0, 0], [250, 0], TRANSPARENCY(ORANGER[7], .9))
    // const section = Create_widget_section(Style_section_default_properties ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[1], .5))
    const section = Create_widget_section(Style_section_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, options: _, pad: [10,10], pos: pos, dim: [0,0], col: TRANSPARENCY(GREY[1], .5), }));
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    // section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    // section.align.flags = ALIGN_2.RESIZE_SELF|ALIGN_2.FIXED_WIDTH;
    section.align.flags = ALIGN_2.RESIZE_SELF;

    // const menu = Create_widget_menubar(_, [0, 0, pos[2]], [250, 0], TRANSPARENCY(GREY[2], 1.), WHITE, 'Menu Bar', [10, 10]);
    // const menu = Create_widget_menubar(_, [0, 0, pos[2]], [250, 0], RGB(0, 0, 4.5, 1.), WHITE, 'Menu Bar', [10, 10]);
    const menu = Create_widget_menubar(_, [0, 0, pos[2]], [250, 0], Interpolate_rgb_to_01(0, 100, 204, 1), WHITE, 'Menu Bar', [10, 10],);
    section.AddItem(menu);
    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


    // menu.AddCloseButton(_, section, 'close', 0, GREY[1], WHITE, [4, 2], _, _, TEXTURES.DEFAULT_FONT);
    // menu.AddCloseButton(_, section, 'close', 0, GREY[1], WHITE, [4, 2], _, _, TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.close_1);

    const size = menu.children.buffer[0].text_mesh.geom.dim[1] * 2 + 12 / 2
    // const size = 90
    {
        // const close_btn = Create_widget_section(0x0, _, [5, 5], [0, 0, 0], [size, size], WHITE, 'close btn', _, _, TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.close_1);
        const close_btn = Create_widget_section(Style_section_default_properties({ is_root: 0x0, options: _, pad: [10,10], pos: pos, dim: [size, size], col: TRANSPARENCY(GREY[4], 1.), texture_id:TEXTURES.MSDF_SYMBOLS, sub_texture_id:ATLASES_SUB_TEXTURES.MSDF_SYMBOLS.close_1, name:'CloseBtn'}));
        close_btn.GfxUniformsEnable({ unif: SID.UNIF.SCREEN_RESOLUTION }, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);
        close_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        close_btn.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        close_btn.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        close_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        close_btn.align.flags = ALIGN_2.HORIZONTAL | ALIGN_2.FLOAT_RIGHT;
        menu.AddItem(close_btn);

        // TODO: Add an add function for vbs with MSDF and ATTR_R_CORNERS-SDF_RECT
        // close_btn.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 3);
        // close_btn.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);



        // {
        //     const btn1 = Create_widget_section(0x0, _, [5,5], [0,0,0], [size, size], WHITE, 'circle_1',_, _, TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._28);
        //     btn1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        //     btn1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     btn1.align.flags = ALIGN_2.HORIZONTAL|ALIGN_2.FLOAT_RIGHT; 
        //     menu.AddItem(btn1); 
        // }
        // {
        //     const btn1 = Create_widget_section(0x0, _, [5,5], [0,0,0], [size, size], WHITE, 'circle_1',_, _, TEXTURES.MSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._25);
        //     btn1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        //     btn1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     btn1.align.flags = ALIGN_2.HORIZONTAL|ALIGN_2.FLOAT_RIGHT; 
        //     menu.AddItem(btn1); 
        // }

    }

    // { // main window panel
    //     // const panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [0, 0, 0], [0, 100], TRANSPARENCY(RGB(0, 0, 4.5, .35), 1.))
    //     // const panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [0, 0, 0], [0, 100], RGB(0, 0, 4.5, .3))
    //     const panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [0, 0, 0], [0, 100], Interpolate_rgb_to_01(10, 44, 129, 1))
    //     panel.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    //     // section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 1);
    //     panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    //     // section.align.flags = ALIGN_2.RESIZE_SELF|ALIGN_2.FIXED_WIDTH;
    //     panel.align.flags = ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL|ALIGN_2.EXPAND|ALIGN_2.FIXED_HEIGHT;
    //     section.AddItem(panel);

    //     // const msg = 'aslpkpaosdksdk\nskdskdlklskd'
    //     // const msg = 'aslpkpaosdksdk'
    //     // const text = Create_widget_label(_, msg, _, [0, 0, 1], 20, TRANSPARENCY(BLUEL[7], .0), WHITE, [0,0], _, _, TEXTURES.MTSDF_COMIC_1024, );
    //     // text.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    //     // text.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    //     // text.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 8);
    //     // text.align.flags = ALIGN_2.HORIZONTAL;
    //     // panel.AddItem(text)
    // }

    const close = section.children.buffer[0].children.buffer[1];

    // HERE: We want the close to be positioned float_right.
    // The menu_bar doesn't have a fixed_width but has expand.
    // // by the time the Align_pre_simple() is called, the menu_bar hasn't been expanded, so the close isn't positoned float_right to the expanded rather the current menu_bar width
    /**
     * SOLUTIONS:
     * 1. We could add re-position functionality (for float_right).
     *  And the Align_expand could be called once, at the creation, set up the dimentions 
     */


    /********************************************************************************************************************************************************/
    // Align
    const ret = Align_pre_simple(section);
    const pad_x = section.StylesGetPad(STYLES.AXIS.X);
    const pad_y = section.StylesGetPad(STYLES.AXIS.Y);
    section.geom.dim[0] = ret.dim_x + pad_x;
    section.geom.dim[1] = ret.dim_y + pad_y;
    // section.geom.pos[0] = pos[0];
    // section.geom.pos[1] = pos[1];
    Align_expand(section, section.align.flags,)


    /********************************************************************************************************************************************************/
    // Render
    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


    section.Render();
    Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
    Construct_listen_events_from_mesh_tree(section)
    Construct_listen_events_relations_from_mesh_tree(section);
    section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);
}

function Test_shaders_operations() { // Shaders Tests

    let rect1 = null;
    {
        // const dim=300
        const dim = 80
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], PURPLE[1], 'TEST-SHADERS',);
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 400, 0], [200, 100], GREEN[9], 'TEST-SHADERS',);
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 400, 0], [200, 100], RED[9], 'TEST-SHADERS',);
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 400, 0], [200, 100], PURPLE[9], 'TEST-SHADERS',);
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], WHITE, 'TEST-SHADERS',);
        const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 400, 0], [200, 100], BLUEL[9], 'TEST-SHADERS',);
        rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 200);


        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT_TEST_WITH_GENERIC_SLIDERS, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

        { // Test Sdf rect with glow
            rect.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
            rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_GLOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            rect.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_GLOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_DIVIDE);
            rect.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_GLOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_DARKEN);
            // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        }

        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SIMPLE_GLOW2, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_CIRCLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.FLARE, SID.BLEND_OPTIONS.BLEND_MODE_MASK);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.FLARE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);


        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.FLARE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.BUBBLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SIMPLE_GLOW, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SIMPLE_GLOW2, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SIMPLE_GLOW2_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_CIRCLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SPECULAR_CIRCLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.DIST_RECT_FILLED, SID.BLEND_OPTIONS.BLEND_MODE_ADD);


        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 8);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        rect.Render();
        Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);

        rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
        rect.GfxUniformSetAndUpdate('u_scale2', [.5, 1]);
        // rect.GfxUniformSetAndUpdate('u_generic_controls', [1, 1, 1, 1, 1, 1]);
        rect.GfxUniformSetAndUpdate('u_generic_controls', [.5, .3, 1.]);

        Construct_listen_events_from_mesh_tree(rect);
        Construct_listen_events_relations_from_mesh_tree(rect);

        rect1 = rect;

    }


    const params = {
        target_mesh1: rect1,
    };

    let ypos = 20;
    const height = 45;

    {
        { // Slider: unif 1
            const slider = CreateSlider(_, 10, ypos, .5, 'Scale');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh1 = params.clbk_params.target_mesh1;
                target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 0);

            }, params,
            );
        } ypos += height;
        { // Slider: unif 2
            const slider = CreateSlider(_, 10, ypos, .4, 'Roundness');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh1 = params.clbk_params.target_mesh1;
                target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 1);

            }, params,
            );
        } ypos += height;
        { // Slider: unif 3
            const slider = CreateSlider(_, 10, ypos, .3, 'Glow Scale');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh1 = params.clbk_params.target_mesh1;
                target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 2);

            }, params,
            );
        } ypos += height;
        { // Slider: unif 4
            const slider = CreateSlider(_, 10, ypos, 1., 'Glow Feather');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh1 = params.clbk_params.target_mesh1;
                target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 3);

            }, params,
            );
        } ypos += height;
        { // Slider: unif 5
            const slider = CreateSlider(_, 10, ypos, .5, 'MIX');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh1 = params.clbk_params.target_mesh1;
                target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 4);

            }, params,
            );
        } ypos += height;
        { // Slider: unif 6
            const slider = CreateSlider(_, 10, ypos, 1., '...');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh1 = params.clbk_params.target_mesh1;
                target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 5);

            }, params,
            );
        } ypos += height;
        { // Slider: unif 7
            const slider = CreateSlider(_, 10, ypos, 1., '...');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh1 = params.clbk_params.target_mesh1;
                target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 6);

            }, params,
            );
        } ypos += height;
        { // Slider: unif 8
            const slider = CreateSlider(_, 10, ypos, .1, '...');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh1 = params.clbk_params.target_mesh1;
                target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 7);

            }, params,
            );
        } ypos += height;
    }


}
/**Test the glow effect on an sdf rect many times over with different blending modes */
function Test_shaders_operations_outer_glow_rect() { // Shaders Tests

    let rect1 = null;
    {
        const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 400, 0], [200, 100], BLUEL[9], 'TEST-SHADERS',);
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 400, 0], [200, 100], YELLOWR[9], 'TEST-SHADERS',);
        // const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 400, 0], [80, 50], YELLOWR[9], 'TEST-SHADERS',);
        rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 100);



        { // Test Sdf rect with glow
            rect.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);

            rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

            // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            rect.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
            // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_RECT2, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            rect.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_GLOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_GLOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
            // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_GLOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_REMOVE_B_FROM_A);
            // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_GLOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MIX);

            // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_GLOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_LIGHTEN);
            // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_GLOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_SUBTRACT);
            // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_GLOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MASK);

            // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_GLOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_DIVIDE);
            // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_GLOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_LIGHTEN);
            // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_GLOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MASK);


            // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_GLOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MIX, .5);
        }

        // rect.EnableGfx(MESH_ENABLE.GFX.FN_INNER_SHADOW);



        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 8);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        rect.Render();
        Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);

        rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
        rect.GfxUniformSetAndUpdate('u_scale2', [2, 1]);
        // rect.GfxUniformSetAndUpdate('u_generic_controls', [1, 1, 1, 1, 1, 1]);
        rect.GfxUniformSetAndUpdate('u_generic_controls', [.1, .3, 1., 1, 1, 1, 1, 1]);

        Construct_listen_events_from_mesh_tree(rect);
        Construct_listen_events_relations_from_mesh_tree(rect);

        rect1 = rect;

    }


    const params = {
        target_mesh1: rect1,
    };

    let ypos = 20;
    const height = 45;

    {
        { // Slider: unif 1
            const slider = CreateSlider(_, 10, ypos, .0, 'Scale');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh1 = params.clbk_params.target_mesh1;
                target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 0);

            }, params,
            );
        } ypos += height;
        { // Slider: unif 2
            const slider = CreateSlider(_, 10, ypos, .5, 'Intensity');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh1 = params.clbk_params.target_mesh1;
                target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 1);

            }, params,
            );
        } ypos += height;
        { // Slider: unif 3
            const slider = CreateSlider(_, 10, ypos, .37, 'Scale');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh1 = params.clbk_params.target_mesh1;
                target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 2);

            }, params,
            );
        } ypos += height;
        { // Slider: unif 4
            const slider = CreateSlider(_, 10, ypos, .62, 'Intensity');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh1 = params.clbk_params.target_mesh1;
                target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 3);

            }, params,
            );
        } ypos += height;
        { // Slider: unif 5
            const slider = CreateSlider(_, 10, ypos, .06, 'Scale');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh1 = params.clbk_params.target_mesh1;
                target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 4);

            }, params,
            );
        } ypos += height;
        { // Slider: unif 6
            const slider = CreateSlider(_, 10, ypos, .7, 'Intensity');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh1 = params.clbk_params.target_mesh1;
                target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 5);

            }, params,
            );
        } ypos += height;
        { // Slider: unif 7
            const slider = CreateSlider(_, 10, ypos, 1., 'Scale');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh1 = params.clbk_params.target_mesh1;
                target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 6);

            }, params,
            );
        } ypos += height;
        { // Slider: unif 8
            const slider = CreateSlider(_, 10, ypos, .1, 'Intensity');

            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {

                const target_mesh1 = params.clbk_params.target_mesh1;
                target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 7);

            }, params,
            );
        } ypos += height;
    }


}





/*************************************************************************************************************************************/
// NEED RE-IMPLEMENTATION
/*************************************************************************************************************************************/


/** */
// function CreateWindowWithMenu() {

//     const pos = [200, 200, 0]

//     const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [6, 6], pos, [0, 0], TRANSPARENCY(GREEN[2], .9))
//     section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
//     section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     section.SetName('ROOT')
//     section.StateEnable(MESH_STATE.IS_RESIZEABLE);
//     section.type |= MESH_TYPE.WIDGET_WINDOW;

//     const menu = Create_widget_menubar(_, [0, 0, pos[2]], _, TRANSPARENCY(GREY[1], .4), WHITE, 'Menu Bar', [10, 6]);
//     section.AddItem(menu);
//     menu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


//     const l1 = Create_widget_label(_, 'Hi', _, _, 8, TRANSPARENCY(GREY[1], 1.0), WHITE);
//     l1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//     menu.AddToMenuBar(l1);
//     const l2 = Create_widget_label(_, 'Hi', _, _, 8, TRANSPARENCY(PURPLER[5], 1.0), WHITE);
//     l2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//     menu.AddToMenuBar(l2);
//     // Create dropdown menu
//     const dp = Create_widget_dropdown(_, 'Options', [0, 0, 0], GREY[1], TRANSPARENCY(YELLOWL[8], .3), WHITE, _, _, _, _, [2, 2]);
//     dp.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//     Dropdown_roots_set_root(dp, dp);
//     dp.menu.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT | SECTION.EXPAND;
//     dp.options = SECTION.VERTICAL;
//     menu.AddToMenuBar(dp, REL_POS.LEFT);


//     // Add a switch to the menu's dropdown
//     const switch1 = CreateSwitchSimple([0, 0, pos[2]], 0);
//     dp.AddToMenu(switch1);

//     // Add a dp to the menu's dropdown
//     const dp_menu = CreateDropdownTree([0, 0, pos[2]], 0, null)
//     dp.AddToMenu(dp_menu);

//     {
//         const label = Create_widget_label(_, 'Hi', _, _, 8, TRANSPARENCY(BLUEL[9], .9), WHITE);
//         label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//         dp.AddToMenu(label);
//     }
//     {
//         const label = Create_widget_label(_, 'Hi', _, _, 8, TRANSPARENCY(BLUEL[9], .9), WHITE);
//         label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//         dp.AddToMenu(label);
//     }
//     {
//         const label = Create_widget_label(_, 'Hi', _, _, 8, TRANSPARENCY(BLUEL[9], .9), WHITE);
//         label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//         dp.AddToMenu(label);
//     }
//     menu.AddToMenuBar(dp, REL_POS.LEFT);

//     menu.AddCloseButton(_, section, 'x');
//     menu.AddMinimizeButton(_, section);





//     // menu.options = SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.EXPAND;
//     menu.options = SECTION.HORIZONTAL | SECTION.EXPAND;

//     // Create items for the section

//     {
//         // const s = Create_widget_section(_, SECTION.VERTICAL, [6, 6], pos, [0, 0], TRANSPARENCY(PURPLEB[2], .9))
//         // s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//         // s.SetName('Window Section')
//         // section.AddItem(s)
//         // {
//         //     const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
//         //     label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//         //     s.AddItem(label)
//         // }
//         // {
//         //     const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
//         //     label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//         //     s.AddItem(label)
//         // }
//         // {
//         //     const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
//         //     label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//         //     s.AddItem(label)
//         // }
//         {
//             const dp = Create_widget_dropdown(_, 'Dp', [0, 0, 0], YELLOWR[4], GREY[2], _, _, _, _, _, _);
//             dp.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
//             dp.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
//             Dropdown_roots_set_root(dp, dp);
//             section.AddItem(dp);

//             {
//                 const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
//                 label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//                 dp.AddToMenu(label)
//             }
//             {
//                 const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
//                 label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//                 dp.AddToMenu(label)
//             }
//             {
//                 const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
//                 label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//                 dp.AddToMenu(label)
//             }
//             {
//                 const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
//                 label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//                 dp.AddToMenu(label)
//             }
//             {
//                 const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
//                 label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//                 dp.AddToMenu(label)
//             }
//             {
//                 const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
//                 label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//                 dp.AddToMenu(label)
//             }
//             {
//                 const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
//                 label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//                 dp.AddToMenu(label)
//             }
//             {
//                 const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
//                 label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//                 dp.AddToMenu(label)
//             }
//             {
//                 const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
//                 label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//                 dp.AddToMenu(label)
//             }
//             {
//                 const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
//                 label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//                 dp.AddToMenu(label)
//             }
//         }
//         {
//             const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
//             label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//             section.AddItem(label)
//         }
//         {
//             const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
//             label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//             section.AddItem(label)
//         }
//     }


//     section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


//     section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);

//     section.options = SECTION.VERTICAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
//     section.Calc_no_gfx_update();
//     section.options &= ~SECTION.RESIZE_PARENT;

//     section.Render();
//     Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

//     Construct_listen_events_from_mesh_tree(section)
//     Construct_listen_events_relations_from_mesh_tree(section);


//     section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)

//     // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
//     View_build_group_from_root_mesh(section);
//     // View_set_view_vb_start(section.group_bufferidxs, section.gfx.vb.start);
// }

/** */
// function CreateSceneMenuBar(items = null) {

//     const pos = [0, 0, 0]
//     const margin = [6, 6];
//     const style = { rcorners: 8, feather: 2, border: 0 };

//     const dim = [VIEWPORT.WIDTH / 2 - margin[0], 100];

//     const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [6, 6], pos, dim, TRANSPARENCY(GREY[1], 1.), _, style,)
//     section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
//     section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     section.SetName('Main Window')
//     section.StateEnable(MESH_STATE.IS_RESIZEABLE);
//     section.type |= MESH_TYPE.WIDGET_WINDOW;
//     section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//     const menu = Create_widget_menubar(_, [0, 0, pos[2] + 1], dim, TRANSPARENCY(BLUEL[6], 1.), WHITE, 'Menu Bar', [10, 6], _, style);
//     // menu.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//     section.AddItem(menu);


//     // Create statistics menu
//     const statistics = Debug_info_ui(_, [0, 0, 0]);
//     menu.AddToMenuBar(statistics, REL_POS.LEFT);

//     menu.AddCloseButton(_, section, 'x', 8, TRANSPARENCY(BLUEL[6], 1.), BLUEL[1], _, 10, style);
//     menu.AddMinimizeButton(_, section, 8, TRANSPARENCY(BLUEL[6], 1.), BLUEL[1], _, 10, _, style);

//     menu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


//     // // menu.options = SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.EXPAND;
//     menu.options = SECTION.HORIZONTAL | SECTION.EXPAND;


//     // Create Window items
//     if (items && Array.isArray(items)) {

//         for (let i = 0; i < items.length; i++) {

//             section.AddItem(items[i]);
//         }
//     }
//     // {
//     //     const dp = Create_widget_dropdown(_, 'Dp', [0, 0, 0], YELLOWR[4], GREY[2], _, _, _, _, _, _);
//     //     dp.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
//     //     dp.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
//     //     Dropdown_roots_set_root(dp, dp);
//     //     section.AddItem(dp);

//     //     {
//     //     const switch1 = CreateSwitchSimple([0,0,pos[2]], 0);
//     //     dp.AddToMenu(switch1);
//     //     }
//     //     {
//     //     const switch1 = CreateSwitchSimple([0,0,pos[2]], 0);
//     //     dp.AddToMenu(switch1);
//     //     }
//     //     {
//     //     const switch1 = CreateSwitchSimple([0,0,pos[2]], 0);
//     //     dp.AddToMenu(switch1);
//     //     }
//     // }
//     // // Create Second dropdown in the windows area
//     // {
//     //     const dp = Create_widget_dropdown(_, 'Dp', [0, 0, 0], YELLOWR[4], GREY[2], _, _, _, _, _, _);
//     //     dp.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
//     //     dp.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
//     //     Dropdown_roots_set_root(dp, dp);
//     //     section.AddItem(dp);

//     //     {
//     //     const switch1 = CreateSwitchSimple([0,0,pos[2]], 0);
//     //     dp.AddToMenu(switch1);
//     //     }
//     //     {
//     //     const switch1 = CreateSwitchSimple([0,0,pos[2]], 0);
//     //     dp.AddToMenu(switch1);
//     //     }
//     //     {
//     //     const switch1 = CreateSwitchSimple([0,0,pos[2]], 0);
//     //     dp.AddToMenu(switch1);
//     //     }
//     // }


//     section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC, section);
//     section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);

//     section.options = SECTION.VERTICAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.FIXED_W;
//     section.Calc_no_gfx_update();
//     section.options &= ~SECTION.RESIZE_PARENT;

//     if (items && Array.isArray(items)) {
//         const scroller = items[0]
//         View_build_group_from_root_mesh(scroller.scrolled_section);
//         const clip_top = scroller.GetPosY();
//         const clip_bottom = clip_top + scroller.geom.dim[1] * 2;
//         Clipy_from_group(scroller.scrolled_section.group_bufferidxs[0], clip_top, clip_bottom);
//     }
//     section.Render();
//     Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
//     if (items && Array.isArray(items)) {
//         const scroller = items[0]
//         View_set_view_vb_start(scroller.scrolled_section.group_bufferidxs, scroller.scrolled_section.gfx.vb.start);
//     }

//     section.ConstructListeners();

//     section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)

//     Construct_listen_events_from_mesh_tree(section)
//     Construct_listen_events_relations_from_mesh_tree(section);
//     // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
//     View_build_group_from_root_mesh(section);
//     // View_set_view_vb_start(section.group_bufferidxs, section.gfx.vb.start);


//     /** Create Test Animations */
//     // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, dp, .03, 0., 1.)
//     // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, statistics, .01, 0., .4)
//     // const btn = statistics.children.buffer[0]
//     // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, btn.text_mesh, .01, 0.1, .9)
// }

/** Change scroller to new implementation */
/*************************************************************************** */
// Create a right hand side panel
// function CreatePanel(is_root_widget = undefined) {

//     const style = { rcorners: 10, feather: 2, border: 0 }
//     const scrolled = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [30, 0], REDL[7], 'RightPanelScrolledSection', style, _, 1);


//     // Add to scrolled mesh
//     for (let j = 0; j < 2; j++) {


//         const scrolled2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [30, 0], REDL[7], 'RightPanelScrolledSection', style, _, 1);
//         for (let i = 0; i < 4; i++) {
//             const label = Create_widget_label(_, '!', _, [0, 0, 0], 8, GREY[1], WHITE);
//             scrolled2.AddItem(label);
//             label.SetName(`${j}-${i}`);
//         }
//         const scroller2 = Create_widget_scroller(is_root_widget, scrolled2, [80, 60], BLUEL[8], _, _);
//         scrolled.AddItem(scroller2);
//         scroller2.StateEnable(MESH_STATE.ACTIVE);
//         scroller2.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
//         scroller2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//         scroller2.options = SECTION.HORIZONTAL | SECTION.INHERIT;
//         scroller2.scrolled_section.options = SECTION.VERTICAL;
//         scroller2.scrolled_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller2.scrolled_section.mesh_bufferidx);
//         scroller2.SetName(`SCOLLER-${j}`);
//     }


//     const scroller = Create_widget_scroller(is_root_widget, scrolled, [140, 140], BLUEL[8], _, _);

//     scroller.StateEnable(MESH_STATE.ACTIVE);
//     scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
//     scroller.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);


//     scroller.options = SECTION.HORIZONTAL | SECTION.INHERIT;
//     scroller.scrolled_section.options = SECTION.VERTICAL;

//     scroller.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//     scroller.scrolled_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller.scrolled_section.mesh_bufferidx);
//     // scroller.scrolled_section.children.buffer[0].GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller.scrolled_section.children.buffer[0].mesh_bufferidx);
//     // scroller.scrolled_section.children.buffer[1].GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller.scrolled_section.children.buffer[1].mesh_bufferidx);
//     // scroller.scrolled_section.children.buffer[2].GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller.scrolled_section.children.buffer[2].mesh_bufferidx);
//     // scroller.scrolled_section.children.buffer[3].GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller.scrolled_section.children.buffer[3].mesh_bufferidx);
//     // scroller.scrolled_section.children.buffer[1].GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller.scrolled_section.children.buffer[1].mesh_bufferidx);
//     // scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

//     if (is_root_widget !== undefined) {

//         scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
//         // scroller.ScrollerAlignWithItemsRecalc();

//         // scroller.SetPosYNoGfxUpdate(200)
//         scroller.SetPosXNoGfxUpdate(100)

//         View_build_group_from_root_mesh(scroller.scrolled_section);
//         const clip_top = scroller.GetPosY();
//         const clip_bottom = clip_top + scroller.geom.dim[1] * 2;
//         Clipy_from_group(scroller.scrolled_section.group_bufferidxs[0], clip_top, clip_bottom);

//         scroller.Render();
//         Root_group_activate_all_vbs_in_renderqueue(scroller.root_bufferidx);

//         scroller.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, scroller.gfx.vb.groupidx);

//         View_set_view_vb_start(scroller.scrolled_section.group_bufferidxs, scroller.scrolled_section.gfx.vb.start);
//         // View_build_group_from_root_mesh(scroller.scrolled_section);

//         scroller.ConstructListeners();
//     }

//     return scroller
// }