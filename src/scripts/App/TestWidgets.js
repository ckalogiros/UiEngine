"use strict";
import { FloorArr2, FloorArr3, Mult_arr3_scalar } from '../Helpers/Math/MathOperations.js';


import { DEBUG_PRINT_KEYS } from '../Engine/Controls/Input/Keyboard.js';

import { Dropdown_roots_set_root } from '../Engine/Drawables/Widgets/Widget_Dropdown.js';
import { Debug_info_create_ui_focused, Debug_info_create_ui_mouse, Debug_info_ui, Debug_info_ui_static, Debug_info_ui_static_app_generic_buffers_container, Debug_info_ui_static_app_generic_buffers, Debug_info_ui_static_app_int16_buffers, Debug_info_ui_static_app_int8_buffers, Debug_info_ui_static_more_performance_timers } from '../Engine/Drawables/DebugInfo/DebugInfoUi.js';
import { GetRandomColor, GetRandomInt, GetRandomPos, GetSequencedColor } from '../Helpers/Helpers.js';
import { Create_rect_mesh, Create_widget_button, Create_widget_close_btn, Create_widget_color_picker, Create_widget_dropdown, Create_widget_label, Create_widget_menubar, Create_widget_minimize_btn, Create_widget_multi_text, Create_widget_scroller, Create_widget_section, Create_widget_slider, Create_widget_slider_simple, Create_widget_switch, Create_widget_switch_simple, Create_widget_text } from '../Engine/Core/CreateWidget.js';
import { Clipy_from_group } from '../Engine/Drawables/Operations/Clip.js';
import { BLACK, BLUE, BLUEL, BLUER, BLUE_10_120_220, COLOR_GRADIENT_VERTICAL, CYAN, GREEN, GREENL, GREENR, GREY, Get_fasma_color, MAGENTA, ORANGE, ORANGEL, ORANGER, ORANGE_240_160_10, PURPLE, PURPLEB, PURPLER, RED, REDL, RGB, TRANSPARENT, WHITE, YELLOW, YELLOWL, YELLOWR } from '../Engine/Drawables/Material/Base/Colors.js';
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
import { Demo_widgets, Demo_widgets_colorpicker, Demo_widgets_colorpicker_demo_with_info, Demo_widgets_msdf_text_rendering, Demo_widgets_scrolled_labels, Demo_widgets_sections } from './Demo/DemoWidgets.js';
import { Board_rotations } from './Demo/DemoBoardRotations.js';
import { Font_metrics_get_char_width, Font_metrics_get_face_advancex, Font_metrics_get_row_height } from '../Engine/Loaders/Font/Font.js';
import { Tetris } from './Demo/Games/Snake/Tetris.js';
import { Bitwise_operations_run_test } from '../Engine/Core/BitwiseOps.js';
import { Arkanoid_initialize } from './Demo/Games/Arkanoid/Arkanoid.js';
import { Widget_ready_slider } from './Widgets/ReadyWidgets.js';
import { Effects_create_explosion_circle, Effect_explosion_circle_get_mesh_byidx } from '../Engine/Drawables/Effects/Effects.js';
import { Style_widget_default } from './Widgets/WidgetStyles.js';
import { CALLBACK_ANIMATION_TYPE_FLAGS } from '../Engine/Animations/CallbackAnimationsReadyAnimations.js';













export function TestWidgetsGeneric() {


    let ypos = 500


    // Bitwise_operations_run_test();

    { // Statistics
        let yy = 0, pp = 23;
        // Debug_info_ui_static(ROOT_WIDGETS.CREATE_ROOT);
        // Debug_info_ui_static_more_performance_timers(ROOT_WIDGETS.CREATE_ROOT, 0, 40);
        // Debug_info_ui(ROOT_WIDGETS.CREATE_ROOT);    
        // Debug_info_create_ui_mouse();
        // Debug_info_ui_static_app_generic_buffers_container(ROOT_WIDGETS.CREATE_ROOT, 0, yy+=pp);
        // Debug_info_ui_static_app_generic_buffers(ROOT_WIDGETS.CREATE_ROOT, 0, yy+=pp);
        // Debug_info_ui_static_app_int16_buffers(ROOT_WIDGETS.CREATE_ROOT, 0, yy+=pp);
        // Debug_info_ui_static_app_int8_buffers(ROOT_WIDGETS.CREATE_ROOT, 0, yy+=pp);
    }

    // CreateLabelMsdf(_, '>', TEXTURES.MSDF_CONSOLAS_1024, 300, 250, 75, TRANSPARENT, BLUEL[9], _, );


    // Demo_page();
    // Demos_welcome_menu();

    { // Games
        // Arkanoid_initialize();
        Tetris(ROOT_WIDGETS.CREATE_ROOT, 20, 132);
        // Game_snake(45, true);
    }







    // Test: Set Focused
    // CreateSectionedWidgets([100, 20, 0], 'Section 1')
    // CreateSectionedWidgets([100, 170, 0], 'Section 2')



    { // Annimations

        { // Demo_animations();
            // Demo_clbk_animations_text_counter(ROOT_WIDGETS.CREATE_ROOT, true, );
        }

        { // Callback Animations
            // Demo_animations_ready_button_anim(ROOT_WIDGETS.CREATE_ROOT, 220, 20, CALLBACK_ANIMATION_TYPE_FLAGS.SCALE);
            // Demo_animations_ready_button_anim(ROOT_WIDGETS.CREATE_ROOT, 20, 20, CALLBACK_ANIMATION_TYPE_FLAGS.MOVE_XY);
            // Demo_animations_ready_button_anim(ROOT_WIDGETS.CREATE_ROOT, 420, 20, CALLBACK_ANIMATION_TYPE_FLAGS.MOVE_XY|CALLBACK_ANIMATION_TYPE_FLAGS.SCALE);
        }

        { // Mesh Animations

            // const line = SdfLine(GREEN[7], [300, 300, 5], [200, 10], SID.ATTR.COL4|SID.ATTR.WPOS3);
            // const line = SdfLine(GREEN[7], [300, 300, 5], [200, 10]);

            // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, line, .01, .1, 1., _, .5, false)

            // Mesh_animations_create(ANIMATIONS.TYPE.WPOS|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.POS.XY, line, .5, -5., 5., 0)

            // Mesh_animations_create(ANIMATIONS.TYPE.WPOS|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.POS.X, line, .5, -5., 5., 0)
            // Mesh_animations_create(ANIMATIONS.TYPE.WPOS|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.POS.Y, line, .5, -5., 5., 0)
            // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, line, .1, .0, 1.,)
            // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, line, .005, .2, .5, .2)
            // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, line, .0025, .2, .8, .2)
            // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RG, line, .01, .2, .8, _, .2, false)
            // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RGB, line, .01, .1, .1, _, .5, true)
            // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, line, .001, .2, 1.4, _, .4, true)
            // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, line, .001, .2, 1.4, _, .4, true)

        }
    }

    { // Reload
        // Test_reload_app();
    }

    { // Textured Meshes
        // Test_create_textured_mesh();

        // TexturedSection(ROOT_WIDGETS.CREATE_ROOT, _, 30, 30, [64/2, 73/2], WHITE, [0,0], TEXTURES.TEST_APPLE);

        // TexturedSection(ROOT_WIDGETS.CREATE_ROOT, _, 30, 30, [32/2, 32/2], WHITE, [0,0], TEXTURES.COIN);
    }

    { // Test sdf lines
        // const line1 = SdfLine(YELLOW[7], [50, 250, 1], [200, 150]);
    }

    { // Rotation: Rotate sdf line. Dont forget to disable the 'style' attribute

        // Test_rotate_section_with_round_corners();

    }

    { // Resize section

        // SectionResizable([50, 150, 0])
    }

    { // Widget: Colorpicker

        // Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, 0, 100, _, _, _, _, _, _, 0x0);

        /* Test change color of a mesh using the colorpicker */
        {
            //     const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [0, 0], [100, 600, 0], [200, 80], TRANSPARENCY(GREEN[2], 1.), 'ColorPicker');
            //     rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
            //     rect.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            //     rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
            //     rect.Render();


            //     Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);
            //     rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx);
            //     Construct_listen_events_from_mesh_tree(rect);
            //     Construct_listen_events_relations_from_mesh_tree(rect);


            //     const color_picker = Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, 0, 100, _, _, _, _, _, _, 0x0, )

            //     const params = {
            //         mnemonics:{transparency:0.5, hue:0.5, color:null},
            //     };
            //     color_picker.AssignTargetMeshClbk(
            //         (params)=>{
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

    { // Widget: Slider-switch

        // CreateSliderSimple();
        // CreateSlider();

        // CreateSwitchSimple([0, ypos, 0]);
        // const switch1 = CreateSwitch();
    }

    { // Widget: Label-buttons

        { // MSDF

            // Demo_widgets_msdf_text_rendering(10, 100);


            // CreateLabelMsdf(_, 'Absr', TEXTURES.MSDF_CONSOLAS_1024, 300, 250, 45, _, _, _);

            // CreateLabelMsdf(_, 'The quick brown foxjums over the', TEXTURES.MSDF_COMIC_1024, 0, 550, 20, _, _, _);
            // CreateLabelMsdfWithScale(_, 'The quick\nbrown fox\njumps over', TEXTURES.MSDF_COMIC_1024, 0, 550, 20, _, _, _);


        }

        // !\"#$%&\'()*+,-./:;<=>?@[\\]^_\`{|}~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
        // CreateLabel(_, '!\"#$%&\'()*+,-./:;<=>?@[\\]^_\`{|}~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', TEXTURES.CONSOLAS_28px, 0, 250);
        // CreateLabel(_, '()*+,-./:;<=>?@[\\]^_\`{|}~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', TEXTURES.CONSOLAS_157px, 0, 250,);
        // const label = CreateLabel(_, '!\"#$%&\'()*+,-./:;<=>?@[\\]^_\`~~{|}0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', TEXTURES.CONSOLAS_66px, 0, 300);

        // const label = CreateLabel('1');
        // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, label, .03, 0., 1.)

        // CreateLabel(_, 'Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, line);');
        // CreateLabel('Gl._framebuffer:-{render}|[mesh](FB.agqtpQji,TYPE.DIMENTION!,@23#scene,(label);');
        // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, label);
        // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, label);

        // const button = CreateButton(); 
        // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, button);
    }

    { // Widget: Dropdown

        // TEST_LISTENERS_CreateDropdown([400, 200, 0])

        // CreateDropdownTree([400, 200, 0])
        // CreateDropdownWithScroller([0, 200, 0])
        // CreateDropdown2InSection([0, ypos+=40, 0], 0);
        // CreateDropdown3([0, ypos+=40, 0], 0);
    }

    { // Widget: Scroller

        // const scroller = CreateScrollerClampAlphaTest(10)

        // TestScrollerComponent();

        // TestScrollerComponent2(); // TODO: Uses double scroller and does NOT work properly 

        // TestScrollerComponent3(); // TODO: Uses nested scrollers and does NOT work properly

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

            // let y = 0;
            // const pad = 50;
            /* section/rect move */
            /* sections - hovering (no moving so that for android devices can hover on touch) */
            // const sections = Demo_widgets_sections(_, [0, y]);
            // y += sections.geom.dim[1]*2 + pad;


            /* label - move - hover */
            /* Button - click(with counter?) */
            /* Switces */
            /* Slider */
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
            //     btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

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
            //     btn.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
            //     btn.Render()
            //     Root_group_activate_all_vbs_in_renderqueue(btn.root_bufferidx);

            //     btn.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, btn.gfx.vb.groupidx)

            //     Construct_listen_events_from_mesh_tree(btn)
            //     Construct_listen_events_relations_from_mesh_tree(btn);

            // }

        }

        { // Animations

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

    { // Section Synthesizes 
        // TestSections1();

        // CreateManySections();

        // const blu = CreateManySectionsMinimal()
    }

    // TODO: NEEDS REIMPLEMENTION
    { // Framebuffer

        // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, helpui);

        // const meshinfo_mesh = MeshInfo(scene)
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

    // CreateLabelMsdf(_, '123', TEXTURES.MSDF_CONSOLAS_1024, 300, 250, 45, _, _, _);


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
    reload_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

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
    reload_btn.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
    reload_btn.Render()
    Root_group_activate_all_vbs_in_renderqueue(reload_btn.root_bufferidx);

    reload_btn.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, reload_btn.gfx.vb.groupidx)

    Construct_listen_events_from_mesh_tree(reload_btn)
    Construct_listen_events_relations_from_mesh_tree(reload_btn);
}
function Test_create_textured_mesh() {

    const t = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [0, 0], [10, 20, 0], [256 / 2, 256 / 2], WHITE, _, _, _, TEXTURES.SMOKE_1);
    t.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
    t.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    t.EnableGfx(MESH_ENABLE.GFX.ATTR_TEX2);

    t.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC)
    t.Render();
    Root_group_activate_all_vbs_in_renderqueue(t.root_bufferidx);
    Construct_listen_events_from_mesh_tree(t);
    Construct_listen_events_relations_from_mesh_tree(t);
    t.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, t.gfx.vb.groupidx);
}
function Test_rotate_section_with_round_corners() {

    const line1 = SdfLine(GREEN[7], [300, 300, 5], [200, 10]);
    Time_intervals_create(16, 'TEST ROTATION', TIME_INTERVAL_REPEAT_ALWAYS, (params) => {
        const mesh = params.params
        // const t = (Timer_get_global_timer_cycle()-.5)*10;
        const t = (Timer_get_global_timer()) * 1;
        mesh.RotateZ(t);
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
    const mesh = Create_widget_label(ROOT_WIDGETS.CREATE_ROOT, '1', _, [x, y, 0], _, BLUEL[9], WHITE, [text_pad_x, text_pad_y], _, _, TEXTURES.CONSOLAS_32px);
    mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(BLUEL[3], BLUEL[9]));
    mesh.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);


    mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    mesh.Render()
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
            if (clbk_anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_X | CLBK_ANIMATIONS.TEXT_TRANSLATE_X)) limit = Font_metrics_get_char_width(mesh.text_mesh.mat.fontidx, text_substitution) / 2;
            else if (clbk_anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_Y | CLBK_ANIMATIONS.TEXT_TRANSLATE_Y)) limit = Font_metrics_get_row_height(mesh.text_mesh.mat.fontidx) / 2;

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

    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [20, 20], [x, y, 0], _, GREY[2]);
    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[1], GREY[4]));
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);


    const mesh2 = Create_widget_label(_, '-', _, [0, 0, 0], _, BLUEL[9], WHITE, [text_pad_x, text_pad_y], _, _, TEXTURES.CONSOLAS_32px);
    {
        mesh2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        mesh2.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
        mesh2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        mesh2.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREEN[2], GREEN[7]));
        mesh2.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        section.AddItem(mesh2)
    }
    // const mesh1 = Create_widget_label(_, '.', _, [40, 10, 0], _, BLUEL[9], WHITE, [text_pad_x, text_pad_y], _, _, TEXTURES.CONSOLAS_32px);
    const mesh1 = Create_widget_label(_, '.', _, [0, 0, 0], _, BLUEL[9], WHITE, [text_pad_x, text_pad_y], _, _, TEXTURES.CONSOLAS_32px);
    // const mesh1 = Create_widget_label(_, '.', _, [40, 10, 0], _, BLUEL[9], WHITE, [10, 0], _, _, TEXTURES.CONSOLAS_32px);
    {
        mesh1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        mesh1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
        mesh1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        mesh1.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(YELLOWR[2], YELLOWR[9]));
        section.AddItem(mesh1)
    }


    section.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENT;
    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);

    section.Calc_no_gfx_update();

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
                if (clbk_anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_X | CLBK_ANIMATIONS.TEXT_TRANSLATE_X)) limit_ = Font_metrics_get_char_width(mesh1.text_mesh.mat.fontidx, text_substitution_) / 2;
                else if (clbk_anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_Y | CLBK_ANIMATIONS.TEXT_TRANSLATE_Y)) limit_ = Font_metrics_get_row_height(mesh1.text_mesh.mat.fontidx) / 2;
                Demo_clbk_animations_text_create(mesh2, slope_params_pointer, limit_, 'TEST_text_animation_2', clbk_anim_flag, text_substitution_);
            }
            if (params.params.counter2 > 9) { params.params.counter2 = 0; }

            const text_substitution = `${params.params.counter1++}`

            let limit = 0;
            if (clbk_anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_X | CLBK_ANIMATIONS.TEXT_TRANSLATE_X)) limit = Font_metrics_get_char_width(mesh1.text_mesh.mat.fontidx, text_substitution) / 2;
            else if (clbk_anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_Y | CLBK_ANIMATIONS.TEXT_TRANSLATE_Y)) limit = Font_metrics_get_row_height(mesh1.text_mesh.mat.fontidx) / 2;

            Demo_clbk_animations_text_create(mesh1, slope_params_pointer, limit, 'TEST_text_animation_1', clbk_anim_flag, text_substitution);
        },
        params,
    );

}




function TexturedSection(root_widget = 0x0, name = 'TexturedSection', x = 0, y = 0, dim = [32 / 2, 32 / 2], color = WHITE, pad = [0, 0], textureid = TEXTURES.COIN) {

    const section = Create_widget_section(root_widget, _, pad, [x, y, 0], dim, color, _, _, _, textureid);
    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    // section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.SetName(name);

    // section.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);
    // section.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3|SID.ATTR.R_CORNERS|SID.ATTR.FEATHER);
    // section.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3|SID.ATTR.DIM2|SID.ATTR.R_CORNERS|SID.ATTR.FEATHER);
    // section.sid.inst = (SID.ATTR.WPOS3|SID.ATTR.DIM2|SID.ATTR.R_CORNERS|SID.ATTR.FEATHER);

    if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {


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
function Section(root_widget = 0x0, name = 'Section ', x = 0, y = 0, dim = [20, 20], color = PURPLEB[6], pad = [10, 10], textureid = INT_NULL) {

    // const section = Create_widget_section(root_widget, _, pad, [x, y], dim, color, _, );
    const section = Create_widget_section(root_widget, _, pad, [x, y, 0], dim, color, _, _, _, textureid);
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

    if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {


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

    // section.GfxUniformsEnable({ unif: SID.UNIF.FS_GENERIC_FLOAT, pass: SID.PASS.WPOS3, }, 'u_generic_float', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);

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
    section.GfxUniformsEnable({ unif: SID.UNIF.FS_GENERIC_FLOAT, pass: SID.PASS.WPOS3, }, 'u_generic_float', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);


    section.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
    section.GenGfxCtx();

    section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
    // section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
    section.Calc_no_gfx_update();

    section.Render();

    // section.RotateZ(.0);
    // section.RotateZ(.3);
    // section.GfxUniformSetAndUpdate('u_generic_float', .3, _);
    // // s.GfxUniformsEnable({ unif: SID.UNIF.FS_GENERIC_FLOAT, pass: SID.PASS.WPOS3, }, 'u_generic_float', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);
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

    // section.GfxUniformsEnable({ unif: SID.UNIF.FS_GENERIC_FLOAT, pass: SID.PASS.WPOS3, }, 'u_generic_float', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);

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
    // section.GfxUniformsEnable({ unif: SID.UNIF.FS_GENERIC_FLOAT, pass: SID.PASS.WPOS3, }, 'u_generic_float', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);


    section.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
    section.GenGfxCtx();

    section.options = SECTION.TOP_DOWN | SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
    // section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
    section.Calc_no_gfx_update();

    section.Render();

    // section.RotateZ(.0);
    // section.RotateZ(.3);
    // section.GfxUniformSetAndUpdate('u_generic_float', .3, _);
    // // s.GfxUniformsEnable({ unif: SID.UNIF.FS_GENERIC_FLOAT, pass: SID.PASS.WPOS3, }, 'u_generic_float', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);
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

    const grey = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, marg, pos, dim, TRANSPARENCY(BLUEL[5], tr), _, [, dim[1], 2]);
    grey.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    grey.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    grey.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    grey.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    grey.StateEnable(MESH_STATE.IS_RESIZEABLE);
    grey.SetName(`grey${grey_cnt++}`);


    grey.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


    grey.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    grey.Render();

    grey.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, grey.gfx.vb.groupidx)

    Root_group_activate_all_vbs_in_renderqueue(grey.root_bufferidx);
    Construct_listen_events_from_mesh_tree(grey);
    Construct_listen_events_relations_from_mesh_tree(grey);

    return grey;
}
function CreateSectionedWidgets(pos, name = 'NO NAME') {

    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [40, 10], pos, [0, 0], GREY[1], name,);
    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS)
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    // section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);


    // Add widgets
    {
        const btn = Create_widget_button(_, 'Button', _, [0, 0, 1], _, GREENL[6], WHITE, [5, 4]);
        btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS)
        btn.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
        btn.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
        btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        section.AddItem(btn);
    }
    {
        const btn = Create_widget_button(_, 'Button', _, [0, 0, 1], _, ORANGER[8], WHITE, [5, 4]);
        btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS)
        btn.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
        btn.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
        btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        section.AddItem(btn);
    }
    {
        const btn = Create_widget_button(_, 'Button', _, [0, 0, 1], _, BLUEL[8], WHITE, [5, 4]);
        btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS)
        btn.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
        btn.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
        btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        section.AddItem(btn);
    }




    // Render
    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);

    section.Calc_no_gfx_update(SECTION.RESIZE_PARENT | SECTION.VERTICAL);

    section.Render();


    Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

    section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)

    Construct_listen_events_from_mesh_tree(section)
    Construct_listen_events_relations_from_mesh_tree(section);

    return section;
}
function CreateLabel(root_widget = ROOT_WIDGETS.CREATE_ROOT, name = 'Label ', font, x = 0, y = 0, color = BLUEL[5], vb_groupidx = INT_NULL, text_vb_groupidx = INT_NULL) {

    const pos = [x, y, 2];
    // const label = Create_widget_label(root_widget, name, _, pos, 0, TRANSPARENCY(color, .2), WHITE, [5, 5], .5, _, font);
    const label = Create_widget_label(root_widget, name, _, pos, 0, TRANSPARENCY(color, .2), WHITE, [0, 0], .5, _, font);
    // label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    label.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
    label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);



    // label.StateEnable(MESH_STATE.IS_HOVER_COLORABLE | MESH_STATE.IS_RESIZEABLE);
    // label.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);
    // label.text_mesh.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);



    if (vb_groupidx !== INT_NULL) label.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, vb_groupidx, text_vb_groupidx);
    else label.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    label.Render()

    label.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, label.gfx.vb.groupidx)

    if (root_widget & ROOT_WIDGETS.CREATE_ROOT) Root_group_activate_all_vbs_in_renderqueue(label.root_bufferidx);
    Construct_listen_events_from_mesh_tree(label);
    Construct_listen_events_relations_from_mesh_tree(label);

    // label.text_mesh.SetColorRGB(REDL);
    // label.text_mesh.RenderTextFromString('REDL');

    // label.Align(ALIGN.BOTTOM | ALIGN.LEFT, [0, 0]);
    // label.Align(ALIGN.BOTTOM | ALIGN.RIGHT, [0, 0]);
    // label.Align(ALIGN.TOP | ALIGN.LEFT, [0, 0]);
    // label.Align(ALIGN.TOP | ALIGN.RIGHT, [0, 0]);

    return label;
}
function CreateLabelMsdf(root_widget = ROOT_WIDGETS.CREATE_ROOT, name = 'Label ', font, x = 0, y = 0, font_size = 20, color = BLUEL[5], text_color = WHITE, vb_groupidx = INT_NULL, text_vb_groupidx = INT_NULL) {

    const pos = [x, y, 2];
    const label = Create_widget_label(root_widget, name, _, pos, font_size, color, text_color, [0, 0], .5, _, font,);
    label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
    label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 4);
    label.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
    label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

    // label.StateEnable(MESH_STATE.IS_HOVER_COLORABLE | MESH_STATE.IS_RESIZEABLE);
    // label.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);
    // label.text_mesh.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);

    if (vb_groupidx !== INT_NULL) label.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, vb_groupidx, text_vb_groupidx);
    else label.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    label.Render()

    label.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, label.gfx.vb.groupidx)

    if (root_widget & ROOT_WIDGETS.CREATE_ROOT) Root_group_activate_all_vbs_in_renderqueue(label.root_bufferidx);
    Construct_listen_events_from_mesh_tree(label);
    Construct_listen_events_relations_from_mesh_tree(label);

    { // abilities

        // label.text_mesh.SetColorRGB(REDL);
        // label.text_mesh.RenderTextFromString('REDL');
        // if(temp_flag) label.text_mesh.RenderTextFromString('AA AS');

        // label.Align(ALIGN.BOTTOM | ALIGN.LEFT, [0, 0]);
        // label.Align(ALIGN.BOTTOM | ALIGN.RIGHT, [0, 0]);
        // label.Align(ALIGN.HOR_CENTER | ALIGN.RIGHT, [0, 0]);
        // label.Align(ALIGN.TOP | ALIGN.LEFT, [10, 10]);
        // label.Align(ALIGN.TOP | ALIGN.RIGHT, [0, 0]);
        // label.Align(ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0]);
    }


    return label;
}
function CreateLabelMsdfWithScale(root_widget = ROOT_WIDGETS.CREATE_ROOT, name = 'Label ', font, x = 0, y = 0, font_size = 20, color = BLUEL[5], vb_groupidx = INT_NULL, text_vb_groupidx = INT_NULL, temp_flag = false) {

    let slider = null

    if (temp_flag) { // Scale Text

        slider = CreateSlider(_, 10, 20, .06, 'ScaleText');
    }

    const pos = [x, y, 2];
    const label = Create_widget_label(root_widget, name, _, pos, font_size, TRANSPARENCY(color, .3), WHITE, [0, 0], .5, _, font,);
    label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
    label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 4);
    label.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
    label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

    // label.StateEnable(MESH_STATE.IS_HOVER_COLORABLE | MESH_STATE.IS_RESIZEABLE);
    // label.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);
    // label.text_mesh.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);

    if (vb_groupidx !== INT_NULL) label.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, vb_groupidx, text_vb_groupidx);
    else label.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    label.Render()

    label.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, label.gfx.vb.groupidx)

    if (root_widget & ROOT_WIDGETS.CREATE_ROOT) Root_group_activate_all_vbs_in_renderqueue(label.root_bufferidx);
    Construct_listen_events_from_mesh_tree(label);
    Construct_listen_events_relations_from_mesh_tree(label);

    { // abilities
        // label.text_mesh.SetColorRGB(REDL);
        // label.text_mesh.RenderTextFromString('REDL');
        // if(temp_flag) label.text_mesh.RenderTextFromString('AA AS');

        // label.Align(ALIGN.BOTTOM | ALIGN.LEFT, [0, 0]);
        // label.Align(ALIGN.BOTTOM | ALIGN.RIGHT, [0, 0]);
        // label.Align(ALIGN.HOR_CENTER | ALIGN.RIGHT, [0, 0]);
        // label.Align(ALIGN.TOP | ALIGN.LEFT, [10, 10]);
        // label.Align(ALIGN.TOP | ALIGN.RIGHT, [0, 0]);
        // label.Align(ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0]);
    }


    if (slider) { // Scale Text

        // const slider = CreateSlider(_, 10, 20, .0, 'ScaleText');

        const params = {
            target_mesh: label,
            mnemonics: {
                sizex: label.geom.dim[0],
                sizey: label.geom.dim[1],
                rcorners: label.mat.style.rcorners
            },
        };

        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh = params.clbk_params.target_mesh;
            const rcorners = params.clbk_params.mnemonics.rcorners;

            const max = 18, min = .1;
            const val = Linear_interpolation(min, max, slider_val);

            {
                const sizex = params.clbk_params.mnemonics.sizex * val;
                const sizey = params.clbk_params.mnemonics.sizey * val;

                target_mesh.geom.dim[0] = sizex;
                target_mesh.geom.dim[1] = sizey;
                target_mesh.geom.SetDimXY(target_mesh.gfx, sizex, sizey);
                Gl_set_dim_xy(target_mesh.gfx, sizex, sizey);

                // target_mesh.geom.pos[0] = sizex;
                // target_mesh.geom.pos[1] = sizey;
                target_mesh.geom.SetWposXY(target_mesh.gfx, sizex, sizey);

                if (target_mesh.sid.attr & SID.ATTR.R_CORNERS) {
                    target_mesh.mat.style.rcorners = rcorners * val;
                    Gl_set_attr_round_corners(target_mesh.gfx, target_mesh.mat.style.rcorners);
                }
            }

            {
                const text = target_mesh.text_mesh;
                text.ScaleText(val)
            }


        }, params,
        );
    }

    return label;
}



function CreateButton(x = 20, y = 400, root_widget = ROOT_WIDGETS.CREATE_ROOT) {

    const btn = Create_widget_button(root_widget, 'Button', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [x, y, 0], fontsize, GREY[1], WHITE, [5, 5], .5);
    btn.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    // btn.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
    btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

    // btn.Bind(()=>{console.log('HI')}, )

    if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

        btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
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



function CreateSwitchSimple(pos, root_widget = ROOT_WIDGETS.CREATE_ROOT) {

    let ypos = 450

    const switch1 = Create_widget_switch_simple(root_widget, pos, 34, _, _, 8);
    switch1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    // switch1.EnableGfxUniforms({ unif: SID.UNIF.FS_RCORNERS_VEC3, }, 'u_rcorners', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
    switch1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    switch1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, switch1.geom.dim[1]);

    if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

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
    const switch1 = Create_widget_switch(ROOT_WIDGETS.CREATE_ROOT, 'switch on', 'switch off', [100, ypos, 0], fontsize, GREY[1], WHITE, [5, 5], .5);
    switch1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    switch1.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    switch1.Bind(function () { console.log('CALLBACK FROM USER !!!!!!!!!!!!!!!!!!!!!!!!!!!') })
    switch1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

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



function CreateSliderSimple(root_widget = ROOT_WIDGETS.CREATE_ROOT) {

    const pos = (root_widget & ROOT_WIDGETS.CREATE_ROOT) ? [200, 500, 0] : [0, 0, 0]
    const slider = Create_widget_slider_simple(ROOT_WIDGETS.CREATE_ROOT, [100, 100, 0], [150, 2], _, [10, 10]);
    slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.2);
    slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 4);
    slider.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);


    if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

        slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
        slider.Render();
        Root_group_activate_all_vbs_in_renderqueue(slider.root_bufferidx);
        slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx)

        Construct_listen_events_from_mesh_tree(slider)
        Construct_listen_events_relations_from_mesh_tree(slider);
    }

    return slider;
}



function CreateSlider(root_widget = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0, initial_val = .5, name) {

    const pos = (root_widget & ROOT_WIDGETS.CREATE_ROOT) ? [x, y, 0] : [0, 0, 0]
    const slider = Create_widget_slider(root_widget, pos, [250, 10], _, _, name);
    // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    slider.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

    slider.SetInitialValue(initial_val);


    if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

        slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
        slider.Render();
        Root_group_activate_all_vbs_in_renderqueue(slider.root_bufferidx);
        slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx)

        Construct_listen_events_from_mesh_tree(slider)
        Construct_listen_events_relations_from_mesh_tree(slider);
    }

    return slider

}




function SdfLine(col, pos, dim, render_instanced_flags = 0x0) {


    const line = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [0, 0], pos, dim, TRANSPARENCY(col, 1), 'sdf linem2', [0, 10, 1.8]);
    line.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    line.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    line.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    // line.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
    // line.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)

    // line.sid.inst = (SID.ATTR.COL4 | SID.ATTR.WPOS3);
    line.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    line.Render();
    Root_group_activate_all_vbs_in_renderqueue(line.root_bufferidx);
    line.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, line.gfx.vb.groupidx)
    Construct_listen_events_from_mesh_tree(line)
    Construct_listen_events_relations_from_mesh_tree(line);

    return line;
}



function CreateDropdownTree(pos = [0, 0, 0], root_widget = ROOT_WIDGETS.CREATE_ROOT) {

    const pad = [10, 4];
    const margin = [5, 5];
    const style = { rcorners: 10, feather: 2, border: 0 };
    const dp = Create_widget_dropdown(root_widget, `ROOT`, pos, YELLOWL[3], GREEN[4], WHITE, pad, _, _, _, _, margin);
    dp.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    dp.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    dp.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);


    Dropdown_roots_set_root(dp, dp);

    let zpos = 0;


    zpos++
    { // Many dps

        const sub_dp1_count = 1;
        const sub_dp2_count = 3;

        const col = GetSequencedColor()
        for (let i = 0; i < sub_dp1_count; i++) {

            const dpsub1 = Create_widget_dropdown(_, `${i}`, [0, 0, zpos + 1], GREY[1], col, WHITE, pad, _, _, _, style, margin);
            dpsub1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
            dpsub1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
            dp.AddToMenu(dpsub1);
            dpsub1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

            const col1 = TRANSPARENCY(PURPLEB[6], 1.);
            for (let j = 0; j < sub_dp2_count; j++) {

                const dpsub2 = Create_widget_dropdown(_, `${i}${j}`, [0, 0, zpos + 2], TRANSPARENCY(GREY[1], 1.), col1, WHITE, pad, _, _, _, style, margin);
                dpsub1.AddToMenu(dpsub2);
                dpsub2.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
                dpsub2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                dpsub2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                dpsub2.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

                const col2 = TRANSPARENCY(GREEN[6], 1.)

                for (let k = 0; k < sub_dp2_count; k++) {

                    const dpsub3 = Create_widget_dropdown(_, `${j}${k}`, [0, 0, zpos + 3], TRANSPARENCY(GREY[1], 1.), col2, WHITE, pad, _, _, _, style, margin);
                    dpsub2.AddToMenu(dpsub3);
                    dpsub3.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
                    dpsub3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                    dpsub3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                    dpsub3.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

                    const col3 = TRANSPARENCY(YELLOW[6], 1.)
                    for (let n = 0; n < sub_dp2_count; n++) {

                        const dpsub4 = Create_widget_dropdown(_, `${j}${k}${n}`, [0, 0, zpos + 4], GREY[1], col3, WHITE, pad, _, _, _, style, margin);
                        dpsub3.AddToMenu(dpsub4);
                        dpsub4.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
                        dpsub4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                        dpsub4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                        dpsub4.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

                    }

                }
            }

        }
    }


    if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

        dp.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
        // dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

        // dp.options = SECTION.EXPAND | SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
        dp.options = SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
        dp.Calc_no_gfx_update();

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



function TEST_LISTENERS_CreateDropdown(pos = [0, 0, 0], root_widget = ROOT_WIDGETS.CREATE_ROOT) {

    // const pad = [10, 2.5]
    const pad = [10, 4]
    const margin = [5, 5]


    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [20, 20], _, [200, 400], BLACK);
    section.options |= SECTION.FIXED_H
    // section.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);


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


    for (let i = 0; i < 2; i++) {
        // const dp = Create_widget_dropdown(root_widget, `ROOT`, pos, YELLOWL[3], GREEN[4], WHITE, pad, _, _, _, margin);
        const dp = Create_widget_dropdown(_, `dp${i}`, [0, 0, 0], YELLOWL[3], GREEN[4], WHITE, pad, _, _, _, margin);
        section.AddItem(dp);
        dp.SetName(`dp${i}`)

        {
            const dp1 = Create_widget_dropdown(_, `dp child`, [0, 0, 0], YELLOWL[3], GREEN[4], WHITE, pad, _, _, _, margin);
            dp.AddToMenu(dp1);
            dp1.SetName(`dp child`)

            for (let j = 0; j < 2; j++) {
                const label = Create_widget_label(_, `label${j}`);
                dp1.AddToMenu(label);
                label.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
            }
        }
        {
            const dp1 = Create_widget_dropdown(_, `dp child`, [0, 0, 0], YELLOWL[3], GREEN[4], WHITE, pad, _, _, _, margin);
            dp.AddToMenu(dp1);
            dp1.SetName(`dp child`)

            for (let j = 0; j < 2; j++) {
                const label = Create_widget_label(_, `label${j}`);
                dp1.AddToMenu(label);
                label.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
            }
        }

        Dropdown_roots_set_root(dp, dp);
    }



    if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

        section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
        // section.options = SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
        section.options = SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.FIXED_H;
        section.Calc_no_gfx_update();
        section.Render();
        Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
        section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)
        Construct_listen_events_from_mesh_tree(section);
        Construct_listen_events_relations_from_mesh_tree(section);
        View_build_group_from_root_mesh(section);
        // View_build_group_from_root_mesh(dp);
    }


}



function CreateDropdownWithScroller(pos = [0, 0, 0], id) {

    // const pad = [10, 2.5]
    const pad = [10, 4]
    const margin = [5, 5]
    // const dp = Create_widget_dropdown(`DP${id}`, pos, GREY[2], BLUE_10_120_220, WHITE, pad);
    const dp = Create_widget_dropdown(ROOT_WIDGETS.CREATE_ROOT, `ROOT`, pos, YELLOWL[3], GREEN[4], WHITE, pad, _, _, _, [10, 2, 2], margin);
    dp.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    dp.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    dp.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
    // dp.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    dp.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    Dropdown_roots_set_root(dp, dp);




    const sub_dp1_count = 2;
    const sub_dp2_count = 1;


    let col = GetSequencedColor()
    for (let i = 0; i < sub_dp1_count; i++) {

        const dpsub1 = Create_widget_dropdown(_, `${i}`, [0, 0, 0], GREY[1], col, WHITE, pad, _, _, _, margin);
        dp.AddToMenu(dpsub1);
        // dpsub1.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        // dpsub1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

        { // Test: Labels
            const l = Create_widget_label(_, 'HI!',);
            dpsub1.AddToMenu(l);
            // l.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            // l.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        }


        col = GetSequencedColor()
        for (let j = 0; j < sub_dp2_count; j++) {

            const dpsub2 = Create_widget_dropdown(_, `${i}${j}`, [0, 0, 0], GREY[1], col, WHITE, pad, _, _, _, margin);
            dpsub1.AddToMenu(dpsub2);
            dpsub2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            dpsub2.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);


            const col2 = GetSequencedColor()
            for (let k = 0; k < sub_dp2_count; k++) {

                const dpsub3 = Create_widget_dropdown(_, `${i}${j}${k}`, [0, 0, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
                dpsub2.AddToMenu(dpsub3);
                dpsub3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                dpsub3.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

                const col3 = GetSequencedColor()
                for (let k = 0; k < sub_dp2_count; k++) {

                    const dpsub4 = Create_widget_dropdown(_, `${i}${j}${k}`, [0, 0, 0], GREY[1], col3, WHITE, pad, _, _, _, margin);
                    dpsub3.AddToMenu(dpsub4);
                    dpsub4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                    dpsub4.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

                    // const s = Create_widget_section(_, SECTION.VERTICAL, [30,20], [0, 0, 4], [30, 10], GREY[1], 'sk1', [0, 5, 1.8]);
                    // dpsub4.AddToMenu(s)

                }

            }
        }

    }

    {
        const l = Create_widget_label(_, 'HI!',);
        dp.AddToMenu(l);
        l.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        l.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    }

    { // Test: Many section
        const sections = CreateManySectionsMinimal(0x0);
        dp.AddToMenu(sections);
        sections.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    }

    { // Test: Slider
        const slider = CreateSliderSimple(0x0);
        // const slider = CreateSlider(0x0);
        dp.AddToMenu(slider);
        // slider.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        slider.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    }

    { // Test: Scroller
        const scroller = CreateScrollerClampAlphaTest(10, 0x0);
        dp.AddToMenu(scroller);
        // scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    }



    col = GetSequencedColor()
    for (let i = 0; i < sub_dp1_count; i++) {

        const dpsub1 = Create_widget_dropdown(_, `${i}`, [0, 0, 0], GREY[1], col, WHITE, pad, _, _, _, margin);
        dp.AddToMenu(dpsub1);
        dpsub1.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        dpsub1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

        // { // Test: Labels
        //     const l = Create_widget_label(_, 'HI!', );
        //     dpsub1.AddToMenu(l);
        //     l.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     l.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        // }


        col = GetSequencedColor()
        for (let j = 0; j < sub_dp2_count; j++) {

            const dpsub2 = Create_widget_dropdown(_, `${i}${j}`, [0, 0, 0], GREY[1], col, WHITE, pad, _, _, _, margin);
            dpsub1.AddToMenu(dpsub2);
            dpsub2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            dpsub2.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
            // console.log()
        }

    }

    dp.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

    // dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
    dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);

    // dp.options = SECTION.EXPAND | SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
    dp.options = SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
    dp.Calc_no_gfx_update();

    dp.Render();
    Root_group_activate_all_vbs_in_renderqueue(dp.root_bufferidx);

    dp.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, dp.gfx.vb.groupidx)

    Construct_listen_events_relations_from_mesh_tree(dp);
    Construct_listen_events_from_mesh_tree(dp)

    // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
    View_build_group_from_root_mesh(dp);

    return dp;
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

    dp.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
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

    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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





function CreateManySectionsMinimal(root_widget = ROOT_WIDGETS.CREATE_ROOT) {

    const tr = .7;

    const blu = Create_widget_section(root_widget, SECTION.VERTICAL, [15, 15], [365, 400, 0], [100, 100], TRANSPARENCY(BLUEL[7], tr), 'blu');
    blu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    blu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


    // blu.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3)

    const red = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(REDL[7], tr), 'red');
    red.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    red.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    // red.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.EXPAND;
    red.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.VERTICAL;
    blu.AddItem(red);



    {

        const black1 = Create_widget_section(_, SECTION.HORIZONTAL, [12, 12], [0, 0, 0], [20, 20], TRANSPARENCY(BLACK, tr), 'black1');
        // black1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        red.AddItem(black1);

        const grey11 = Create_widget_section(_, SECTION.VERTICAL, [12, 12], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[4], tr), 'grey11');
        grey11.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        black1.AddItem(grey11);
        const red111 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(REDL[7], tr), 'red111');
        red111.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        grey11.AddItem(red111);
        const yel_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(YELLOWR[7], tr), 'yel_1');
        yel_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        grey11.AddItem(yel_1);
        const purp12 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLE[7], tr), 'purp12');
        purp12.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        black1.AddItem(purp12);
        const blue13 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(BLUEL[5], tr), 'blue13');
        blue13.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        black1.AddItem(blue13);
        const green14 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREEN[5], tr), 'green14');
        green14.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        black1.AddItem(green14);
        const vert_0 = Create_widget_section(_, SECTION.VERTICAL, [20, 20], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr), 'vert_0');
        vert_0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);


    }





    if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

        blu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        blu.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
        // blu.options = SECTION.INHERIT | SECTION.VERTICAL 
        blu.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.RESIZE_PARENT;
        blu.Calc_no_gfx_update();
        blu.Render();
        Root_group_activate_all_vbs_in_renderqueue(blu.root_bufferidx);
        blu.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, blu.gfx.vb.groupidx);
        Construct_listen_events_from_mesh_tree(blu)
        Construct_listen_events_relations_from_mesh_tree(blu);
    }




    return blu;
}



function CreateManySections(scene) {

    const tr = 1.7;

    // const blu = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [15, 15], [365, 400, 0], [100, 100], TRANSPARENCY(BLUEL[7], tr));
    const blu = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [15, 15], [0, 400, 0], [100, 100], TRANSPARENCY(BLUEL[7], tr));
    blu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    blu.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    blu.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    blu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE); blu.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);


    // blu.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3)

    const red = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(REDL[7], tr));
    red.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    red.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    red.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    red.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    // red.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.EXPAND;
    red.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.VERTICAL;
    blu.AddItem(red);


    const black1 = Create_widget_section(_, SECTION.HORIZONTAL, [12, 12], [0, 0, 0], [20, 20], TRANSPARENCY(BLACK, tr));
    black1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    black1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    black1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
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


    // blu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    blu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    blu.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    // blu.options = SECTION.INHERIT | SECTION.VERTICAL | SECTION.RESIZE_PARENT;
    blu.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.RESIZE_PARENT;
    blu.Calc_no_gfx_update();
    blu.Render();
    Root_group_activate_all_vbs_in_renderqueue(blu.root_bufferidx);
    blu.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, blu.gfx.vb.groupidx);

    Construct_listen_events_from_mesh_tree(blu)
    Construct_listen_events_relations_from_mesh_tree(blu)

    return blu;
}





function CreateScrollerClampAlphaTest(num_items = 10, root_widget = ROOT_WIDGETS.CREATE_ROOT) {

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
    const fontsize = 34;

    const is_root = (root_widget & ROOT_WIDGETS.CREATE_ROOT) ? root_widget : _;
    const section = Create_widget_section(is_root, SECTION.VERTICAL, [10, 10], [30, 30, 0], [20, 20], TRANSPARENCY(GREY[0], 1.));
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 15);
    section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);



    // const count = colors.length;
    const count = num_items;
    for (let i = 0; i < count; i++) {

        const label = Create_widget_label(_, `${i} and `, _, [0, 0, 2], fontsize, TRANSPARENCY(colors[i], 1.7), WHITE, [6, 4], _, _, TEXTURES.CONSOLAS_32px)
        // const label = Create_widget_label(_, `!${i} and \n000\n888`, _, [0, 0, 2], fontsize, TRANSPARENCY(colors[i], 1.7), WHITE, [6, 4], _, _, TEXTURES.CONSOLAS_32px)
        label.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
        label.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        section.AddItem(label);
        label.SetName(`${i}`);
        label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
    }



    if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

        section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        section.options = SECTION.VERTICAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
        section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

        section.Calc_no_gfx_update();


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





function TestScrollerComponent() {

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

        const s = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [100, 100, 0], [100, 40], GREY[4]);
        Style_widget_default(s, rcorners)
        s.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        s.SetName('Main Section');



        let mesh_to_add_scroller1 = null;
        {
            const s2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [100, 40], YELLOWR[4]);
            Style_widget_default(s2, rcorners);
            s.AddItem(s2)
            s2.SetName('SS1');
            s2.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;

            const dp = Create_widget_dropdown(_, 'DP2', [0, 0, 1], GREY[1], PURPLEB[2], _, _, _,);
            Style_widget_default(dp, rcorners)
            Dropdown_roots_set_root(dp, dp);
            dp.SetName('DP1');
            s2.AddItem(dp)

            for (let i = 0; i < 2; i++) {

                const s3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [100, 40], BLUEL[4]);
                Style_widget_default(s3, rcorners)
                s3.SetName('S3');
                dp.AddToMenu(s3)

                const dp1 = Create_widget_dropdown(_, 'DP' + i, [0, 0, 1], GREY[1], PURPLEB[2], _, _, _,);
                Style_widget_default(dp1, rcorners);
                dp1.SetName('DP' + i);
                Dropdown_roots_set_root(dp, dp1);
                // dp.AddToMenu(dp1)
                s3.AddItem(dp1)


                const l = Create_widget_label(_, 'label +++' + i, _, _, _, YELLOWL[6], _, [5, 5]);
                Style_widget_default(l, rcorners)
                dp1.AddToMenu(l)

            }

            // dp.gfx_ctx_flags |= GFX_CTX_FLAGS.FROM_PARENT_ASC|GFX_CTX_FLAGS.PRIVATE;
            // dp.GfxCtxSetFlag( dp.gfx_ctx_flags, dp.mesh_bufferidx);

            mesh_to_add_scroller1 = s2;

        }
        let mesh_to_add_scroller2 = null;
        {

            const s2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [100, 40], YELLOWR[4]);
            Style_widget_default(s2, rcorners);

            s.AddItem(s2)
            s2.SetName('SS2');
            s2.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;

            const dp = Create_widget_dropdown(_, 'DP1', [0, 0, 1], GREY[1], PURPLEB[2], _, _, _,);
            Style_widget_default(dp, rcorners);
            Dropdown_roots_set_root(dp, dp);
            dp.SetName('DP2');
            s2.AddItem(dp)

            for (let i = 0; i < 2; i++) {

                const s3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [100, 40], BLUEL[4]);
                Style_widget_default(s3, rcorners);
                s3.SetName('S3');
                dp.AddToMenu(s3)

                const dp1 = Create_widget_dropdown(_, 'DP' + i, [0, 0, 1], GREY[1], PURPLEB[2], _, _, _,);
                Style_widget_default(dp1, rcorners);
                dp1.SetName('DP' + i);
                Dropdown_roots_set_root(dp, dp1);
                // dp.AddToMenu(dp1)
                s3.AddItem(dp1)


                const l = Create_widget_label(_, 'lklhjksqdkjluhujkuhjhsdsz' + i, _, _, _, YELLOWL[6], _, [5, 5]);
                Style_widget_default(l, rcorners);
                dp1.AddToMenu(l)

            }

            dp.gfx_ctx_flags |= GFX_CTX_FLAGS.FROM_PARENT_ASC | GFX_CTX_FLAGS.PRIVATE;
            dp.GfxCtxSetFlag(dp.gfx_ctx_flags, dp.mesh_bufferidx);

            mesh_to_add_scroller2 = s2;
        }

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
    s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    s.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    Style_widget_default(s, rcorners);
    s.SetName('Scrolled Section');



    let scrolled_meshes_buffer = [];

    const s2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [100, 40], YELLOWR[4]);
    Style_widget_default(s2, rcorners);
    s.AddItem(s2)
    s2.SetName('SS2');


    const dp = Create_widget_dropdown(_, 'DP', [0, 0, 1], GREY[1], PURPLEB[2], _, _, _,);
    Style_widget_default(dp, rcorners);
    Dropdown_roots_set_root(dp, dp);
    dp.SetName('DP');
    s2.AddItem(dp)

    // s2.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;
    // s2.GfxCtxSetFlag(s2.gfx_ctx_flags, s2.mesh_bufferidx);
    scrolled_meshes_buffer.push(s2);


    for (let i = 0; i < 3; i++) {

        const dp1 = Create_widget_dropdown(_, 'DP' + i, [0, 0, 1], GREY[1], PURPLEB[2], _, _, _,);
        Style_widget_default(dp1, rcorners);
        dp1.SetName('DP' + i);
        Dropdown_roots_set_root(dp, dp1);
        dp.AddToMenu(dp1)

        dp1.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;
        dp1.GfxCtxSetFlag(dp1.gfx_ctx_flags, dp1.mesh_bufferidx);
        scrolled_meshes_buffer.push(dp1);

        for (let j = 0; j < 1; j++) {

            const s3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [10, 10, 0], [100, 40], BLUEL[4]);
            Style_widget_default(s3, rcorners);
            s3.SetName('S3');
            dp1.AddToMenu(s3)

            const dp2 = Create_widget_dropdown(_, 'DP' + j, [0, 0, 1], GREY[1], PURPLEB[2], _, _, _,);
            Style_widget_default(dp2, rcorners);
            dp2.SetName('DP' + j);
            Dropdown_roots_set_root(dp1, dp2);
            // dp.AddToMenu(dp1)
            s3.AddItem(dp2)


            for (let k = 0; k < 3; k++) {
                const l = Create_widget_label(_, 'l' + j, _, _, _, YELLOWL[6], _, [5, 5]);
                Style_widget_default(l, rcorners);
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

    const root = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, marg, pos, [0, 0], TRANSPARENCY(BLUEL[5], 1));
    root.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    root.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    root.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    root.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    root.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    root.SetName('root_blue');

    { // Test 1
        const s1 = Sections4(_, SECTION.HORIZONTAL, pos);
        s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
        s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        root.AddItem(s1);
        const s2 = Sections4(_, SECTION.HORIZONTAL, pos);
        s2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        s2.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
        s2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        root.AddItem(s2);
    }

    { // Test 2
        const s1 = Sections2(_, SECTION.VERTICAL, pos);
        s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
        s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
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

    const grey = Create_widget_section(is_root, align, marg, [0, 0, 0], dim, TRANSPARENCY(GREY[0], tr));
    // grey.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    // grey.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    // grey.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    grey.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    grey.SetName(`grey${grey_cnt++}`);

    const green = Create_widget_section(_, SECTION.VERTICAL, marg, [0, 0, 0], dim, TRANSPARENCY(GREEN[3], tr));
    // green.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    // green.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    // green.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    green.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    green.SetName(`green${green_cnt++}`);
    grey.AddItem(green);

    const orange = Create_widget_section(_, SECTION.VERTICAL, marg, [0, 0, 0], dim, TRANSPARENCY(ORANGER[7], tr));
    // orange.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    // orange.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    // orange.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
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


function Help() {


    const flags = (SECTION.ITEM_FIT);

    //options, margin, pos, dim, col, name
    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [20, 20], [200, 5, 0], [0, 0], TRANSPARENCY(GREY[1], .8));
    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.SetName('Help section')

    // scene.StoreMesh(section)
    const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[3], .6));
    s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    s1.SetName('Help section 2')
    // s1.options = SECTION.EXPAND | SECTION.VERTICAL;

    let msgs = [];
    for (let i = 0; i < DEBUG_PRINT_KEYS.length; i++) {

        msgs[i] = '\"' + DEBUG_PRINT_KEYS[i].key + '\": ' + DEBUG_PRINT_KEYS[i].discr

        const label = Create_widget_label(_, msgs[i], ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 7, TRANSPARENCY(YELLOWR[7], 1.), BLACK, [7, 3], .5, [0, 4, 3]);
        label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
        label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 8);
        label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)

        s1.AddItem(label)

    }


    // const minimizer = Create_widget_minimize_btn(_, section, section.geom.pos, 12);
    // minimizer.SetName('minimi')
    // section.AddItem(minimizer);

    section.AddItem(s1)


    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
    Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
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
    rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

    rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
    rect.EnableGfx(MESH_ENABLE.GFX.TEST_SHADERS_1);
    // rect.EnableGfx(MESH_ENABLE.GFX.TEST_SHADERS_2);

    // Use u_time to quicly establish a uniform for the testing
    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

    // Render
    rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
    rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

    rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
    rect.EnableGfx(MESH_ENABLE.GFX.TEST_SHADERS_3);
    // rect.EnableGfx(MESH_ENABLE.GFX.TEST_SHADERS_2);

    // Use u_time to quicly establish a uniform for the testing
    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

    // Render
    rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        // rect.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.TEST_SHADERS_2);

        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        // rect.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.TEST_SHADERS_2);

        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        // rect.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.TEST_SHADERS_4);

        // Use u_time to quicly establish a uniform for the testing
        // rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
        // rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FVEC4, UNIFORM.IN_FS);
        // rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FVEC6, UNIFORM.IN_FS);
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 6);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
    rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

    // Blending mode
    // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_MIX, .0);
    // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_MASK);
    // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_SUBTRACT); // 

    // rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
    rect.EnableGfx(MESH_ENABLE.GFX.FN_INNER_SHADOW);

    // Use u_time to quicly establish a uniform for the testing
    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

    // Render
    rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        // rect.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME);
        rect.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        // rect.EnableGfx(MESH_ENABLE.GFX.TEST_SHADERS_4);
        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_CIRCLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SPECULAR_CIRCLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);


        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 6);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

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
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 60);

        // rect.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 4);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 100);

        rect.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 4);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 100);

        rect.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 4);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 100);

        rect.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 6);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_WORLEY);

        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
        const rect = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], BLUEL[9], 'SHADER_FN:WORLEY-2-NOISE',);
        rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_WORLEY, 2);

        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_WORLEY, 3);

        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        // rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_WORLEY);
        rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_VORONOI, 1);

        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        // rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_WORLEY);
        rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_VORONOI, 2);

        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

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
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

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
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_MIX);
        // rect.EnableGfx(MESH_ENABLE.GFX.FN_GLOW_SPHERE);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.FLARE, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SIMPLE_GLOW2, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);

        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 6);

        // Render
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

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
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

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
        rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

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
//     menu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


//     const l1 = Create_widget_label(_, 'Hi', _, _, 8, TRANSPARENCY(GREY[1], 1.0), WHITE);
//     l1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//     menu.AddToMenuBar(l1);
//     const l2 = Create_widget_label(_, 'Hi', _, _, 8, TRANSPARENCY(PURPLER[5], 1.0), WHITE);
//     l2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//     menu.AddToMenuBar(l2);
//     // Create dropdown menu
//     const dp = Create_widget_dropdown(_, 'Options', [0, 0, 0], GREY[1], TRANSPARENCY(YELLOWL[8], .3), WHITE, _, _, _, _, [2, 2]);
//     dp.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
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
//         label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//         dp.AddToMenu(label);
//     }
//     {
//         const label = Create_widget_label(_, 'Hi', _, _, 8, TRANSPARENCY(BLUEL[9], .9), WHITE);
//         label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//         dp.AddToMenu(label);
//     }
//     {
//         const label = Create_widget_label(_, 'Hi', _, _, 8, TRANSPARENCY(BLUEL[9], .9), WHITE);
//         label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
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


//     section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


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
//     section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//     const menu = Create_widget_menubar(_, [0, 0, pos[2] + 1], dim, TRANSPARENCY(BLUEL[6], 1.), WHITE, 'Menu Bar', [10, 6], _, style);
//     // menu.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//     section.AddItem(menu);


//     // Create statistics menu
//     const statistics = Debug_info_ui(_, [0, 0, 0]);
//     menu.AddToMenuBar(statistics, REL_POS.LEFT);

//     menu.AddCloseButton(_, section, 'x', 8, TRANSPARENCY(BLUEL[6], 1.), BLUEL[1], _, 10, style);
//     menu.AddMinimizeButton(_, section, 8, TRANSPARENCY(BLUEL[6], 1.), BLUEL[1], _, 10, _, style);

//     menu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


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

//     scroller.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//     scroller.scrolled_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller.scrolled_section.mesh_bufferidx);
//     // scroller.scrolled_section.children.buffer[0].GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller.scrolled_section.children.buffer[0].mesh_bufferidx);
//     // scroller.scrolled_section.children.buffer[1].GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller.scrolled_section.children.buffer[1].mesh_bufferidx);
//     // scroller.scrolled_section.children.buffer[2].GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller.scrolled_section.children.buffer[2].mesh_bufferidx);
//     // scroller.scrolled_section.children.buffer[3].GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller.scrolled_section.children.buffer[3].mesh_bufferidx);
//     // scroller.scrolled_section.children.buffer[1].GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller.scrolled_section.children.buffer[1].mesh_bufferidx);
//     // scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

//     if (is_root_widget !== undefined) {

//         scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
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