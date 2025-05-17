"use strict";

import { Callback_animations_create } from "../Engine/Animations/CallbackAnimations.js";
import { Create_rect_mesh, Create_widget_button, Create_widget_close_btn, Create_widget_dropdown, Create_widget_label } from "../Engine/Drawables/Widgets/Helpers/CreateWidget.js";
import { View_build_group_from_root_mesh, View_render_from_view_NEW } from "../Engine/Core/Views/MeshBufferViews.js";
import { Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos, Mesh_unif_get_vb_root_wpos, Screen_wpos_get_y } from "../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue, Root_group_rerender_from_root_reconstruct_listeners, Root_group_reset_gfxs } from "../Engine/Core/Views/RootView.js";
import { Debug_info_ui_static } from "../Engine/Drawables/DebugInfo/DebugInfoUi.js";
import { BLUEL, Color_hsv_to_rgb_calibrated, COLOR_THEME_BASIC, GREEN, GREENR, GREY, ORANGER, REDL, TRANSPARENT, WHITE } from "../Engine/Drawables/Material/Colors.js";
import { Mesh_set_root_in_focus } from "../Engine/Drawables/Operations/MeshHelperFunctions.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../Engine/Events/EventFunctions.js";
import { Components_create_scroller_component, Scoller_component_gengfx_and_render, Scroller_component_calculate_handle_pos_dim } from "../Engine/Drawables/Widgets/ScrollerComponent.js";
import { Listeners_set_priority } from "../Engine/Events/EventListeners.js";
import { Renderqueue_set_active } from "../Engine/Renderers/Renderer/RenderQueue.js";
import { Scene_camera_scroll_add, Scene_camera_scroll_set, Scene_store_window_resized_meshes } from "../Engine/Scenes.js";
import { Vertex_buffer_calculate_render_group_starts, Vertex_buffer_group_create_scissorbox } from "../Graphics/Buffers/VertexBuffers.js";
import { Abs } from "../Helpers/Math/MathOperations.js";
import { App_reinitialize, App_reset } from "./App.js";
import { Create_comet_particles, Create_glow_particles, Create_particles_controls, Comet_create_controls, Create_smoke_particles, Create_explosion_particles, Create_smoke_particles_controls, Demo_glow_particles_sparkles_effect } from "./Demo/DemoParticles.js";
import { Create_elastic_collisions_controls, Elastic_collisions, Sattelite_rotation } from "./Demo/DemoPhysics.js";
import { Demo_widgets, Demo_widgets_colorpicker_demo_with_info, Demo_widgets_dropdown, Demo_widgets_explainer_info, Demo_widgets_msdf_text_rendering, Demo_widgets_scrolled_labels, Demo_widgets_sections } from "./Demo/DemoWidgets.js";
import { Game_snake } from "./Demo/Games/Snake/Snake.js";
import { Board_rotations } from "./Demo/DemoBoardRotations.js";
import { Tetris, Tetris_reset } from "./Demo/Games/Tetris/Tetris.js";
import { Arkanoid_initialize, Arkanoid_reset } from "./Demo/Games/Arkanoid/Arkanoid.js";
import { Widget_gfx_ready_enable, Style_button_default_properties, Style_rect_default_properties, Style_label_default_properties, Style_dropdown_default_properties } from "../Engine/Drawables/Widgets/Helpers/WidgetEnableProperties.js";
import { Mesh_event_callback_create, Mesh_listener_create } from "../Engine/Drawables/Operations/MeshPropertiesFunctions.js";
import { Align_expand, Align_nested_sections_pre } from "../Engine/Drawables/Operations/AlignNestedSections.js";
import { Dropdown_roots_set_root } from "../Engine/Drawables/Widgets/Widget_Dropdown.js";
import { Color_theme_label_auto } from "../Engine/Drawables/Material/Themes.js";
import { Demo_animations, Demo_animations_ready_button_with_panel, Demo_animations_text, Demo_animations_with_slider_slope } from "./Demo/DemoAnimations.js";
import { Demo_chain_link } from "./Demo/DemoChainLink.js";





// TODO: Add grow containers
// TODO: Add some shader noise examples

// const comet_noise_slider_values = new Float32Array([1, 0, .12, 1]);
const comet_noise_slider_values = new Float32Array([0, .38, .12, .34]);
// const comet_noise_slider_values = new Float32Array([0, .8, .12, .9]);
const comet_glow_slider_values = new Float32Array([0., 1, .31]);

const glow_slider_values = [.48, .59, .19, .0, .4];
const glow_generic_controls_parameters = [.0, 1., 1.];

// const explosion_slider_values = new Float32Array([0.06, .5, 1., .5, .5, .5, .05, .05, .5]);
const explosion_slider_values = new Float32Array([.5, 1., .5, .5, .5, .05, .05, .5]);
const explosion_generic_controls_parameters = new Float32Array([.0, .8, .18]);

const sparkles_slider_values = [.48, .6, .35, .08, .4, .04, .04, .55];

// Transform/physics parameters: Gravity , Acceleration , Deccelerarion , Set Emitter X Position , Set Emitter Y Position 
const smoke_slider_values_transform_parameters = new Float32Array([.48, .08, .49, .0, .5]);
// 2 Controls in fragment shader: ctrl1,ctrl2. SEE: fragment shader->main function->U_GENERIC_CONTROLS
const smoke_slider_values_shader_parameters = new Float32Array([.13, .4]);

const elastic_colisions_slider_values = [.3]; // Speed parameter


let bit = 0x1;
let demos_index_cnt = 0;
const close_btn_col = REDL[4];

const _demo_categories_buffer = [

   { // [0]: Widgets
      name: 'Widgets',
      sub_cat: [
         {
            name: 'Standard', id: bit <<= 0x1, idx: 0, category_idx: demos_index_cnt,
            controls_params: {},
            self: null,
            Load: (total_height) => {

               const pad = 50;

               const explainer = Demo_widgets_explainer_info([0, total_height]);
               total_height += explainer.geom.dim[1] * 2 + pad;
         
               const sections = Demo_widgets_sections(_, [0, total_height]);
               total_height += sections.geom.dim[1] * 2 + pad;
         
               const widgets = Demo_widgets(_, [0, total_height,]);
               total_height += widgets.geom.dim[1] * 2 + pad;
         
               const scroller = Demo_widgets_scrolled_labels(_, [0, total_height]);
               total_height += scroller.geom.dim[1] * 2 + pad;
         
               const colorpicker = Demo_widgets_colorpicker_demo_with_info(_, total_height);
               total_height += colorpicker.geom.dim[1] * 2 + pad;
         
               const dp = Demo_widgets_dropdown(_, [0, total_height])
               total_height += dp.geom.dim[1] * 2 + pad;
            }
         },
      ],
      id: bit,
      idx: demos_index_cnt++,
   },
   { // [1]: Text Render
      name: 'Text Render',
      sub_cat: [
         {
            name: 'MTSDF', id: bit <<= 0x1, idx: 0, category_idx: demos_index_cnt,
            controls_params: {},
            self: null,
            Load: (total_height) => {
               Demo_widgets_msdf_text_rendering(10, total_height);
            }
         },
      ],
      id: bit <<= 0x1,
      idx: demos_index_cnt++,
   },
   { // [2]: Particles
      name: 'Particles',
      sub_cat: [
         {
            name: 'Comet', id: bit <<= 0x1, idx: 0,
            controls_params: { generic_contols_parameters: comet_noise_slider_values, glow_control_parameters: comet_glow_slider_values },
            self: null,
            Load: (total_height) => {
               return Create_comet_particles(0, total_height, _, _, 1, ROOT_WIDGETS.CREATE_ROOT, false);
            },
            LoadControls: (self, controls_params) => {
               return Comet_create_controls(
                  self.noise_emitter_buffer, _, controls_params.generic_contols_parameters,
                  'u_generic_controls',
                  self.glow_emitter_buffer, controls_params.glow_control_parameters,
               );
            },
         },
         {
            name: 'Glow', id: bit <<= 0x1, idx: 1,
            controls_params: { slider_values: glow_slider_values, u_generic_controls_parameters: glow_generic_controls_parameters },
            self: null,

            Load: (total_height) => {
               return Create_glow_particles(0, total_height + 150, ROOT_WIDGETS.CREATE_ROOT, false, 1, .36, glow_slider_values,);
            },
            LoadControls: (self, controls_params) => {
               return Create_particles_controls(self.emitter, _, controls_params.slider_values, controls_params.u_generic_controls_parameters, 'u_generic_controls');
            },
         },
         {
            name: 'Smoke', id: bit <<= 0x1, idx: 2,
            controls_params: { slider_values: smoke_slider_values_transform_parameters, u_generic_controls_parameters: smoke_slider_values_shader_parameters },
            self: null,
            Load: (total_height) => {
               return Create_smoke_particles(0, total_height, ROOT_WIDGETS.CREATE_ROOT, false);
            },
            LoadControls: (self, controls_params) => {
               return Create_smoke_particles_controls(self.emitter, _, controls_params.slider_values, _, controls_params.u_generic_controls_parameters, 'u_generic_controls');
            },
         },
         {
            name: 'Explosion', id: bit <<= 0x1, idx: 3,
            controls_params: { slider_values: explosion_slider_values, u_generic_controls_parameters: explosion_generic_controls_parameters },
            self: null,
            Load: (total_height) => {
               // return Create_explosion_particles(0, total_height, ROOT_WIDGETS.CREATE_ROOT, false, 256, explosion_generic_controls_parameters);
               return Create_explosion_particles(0, total_height, ROOT_WIDGETS.CREATE_ROOT, false, 256, _, explosion_slider_values);
            },
            LoadControls: (self, controls_params) => {
               return Create_particles_controls(self.emitter, _, controls_params.slider_values, controls_params.u_generic_controls_parameters, 'u_generic_controls');
            },
         },
         {
            name: 'Sparkles', id: bit <<= 0x1, idx: 3,
            controls_params: { slider_values: sparkles_slider_values, u_generic_controls_parameters: _ },
            self: null,
            Load: (total_height) => {
               // return Create_explosion_particles(0, total_height, ROOT_WIDGETS.CREATE_ROOT, false, 256, explosion_generic_controls_parameters);
               return Demo_glow_particles_sparkles_effect(0, total_height, ROOT_WIDGETS.CREATE_ROOT, _, false, 1, sparkles_slider_values, _);
            },
            LoadControls: (self, controls_params) => {
               return Create_particles_controls(self.emitter, _, controls_params.slider_values, controls_params.u_generic_controls_parameters, 'u_generic_controls');
            },
         },
      ],
      id: bit <<= 0x1,
      idx: demos_index_cnt++,
   },
   { // [3]: Physics
      name: 'Physics',
      sub_cat: [
         {
            name: 'Elastic Collisions', id: bit <<= 0x1, idx: 0,
            controls_params: { slider_values:elastic_colisions_slider_values }, 
            self: null,
            Load: (total_height) => {
               return Elastic_collisions(0, total_height, ROOT_WIDGETS.CREATE_ROOT, false, false);
            },
            LoadControls: (self, controls_params) => { 

               const params = { mnemonics:self.mnemonics};
               return Create_elastic_collisions_controls(self.ellastic_collisions_balls, GREY[2],   controls_params.slider_values, params, 'u_generic_controls')
            },
         },
         {
            name: 'Perimetric Rotation', id: bit <<= 0x1, idx: 1,
            controls_params: {},
            self: null,
            Load: (total_height) => {
               total_height += Sattelite_rotation(0, total_height);
            },
            LoadControls: null,
         },
         {
            name: 'Velocity Verlet', id: bit <<= 0x1, idx: 2,
            controls_params: {},
            self: null,
            Load: (total_height) => {
               Demo_chain_link(_, total_height);
            },
            LoadControls: null,
         },
      ],
      id: bit <<= 0x1,
      idx: demos_index_cnt++,
   },
   { // [3]: Animations
      name: 'Animations',
      sub_cat: [
         {
            name: 'Button Animations', id: bit <<= 0x1, idx: 0, category_idx: 0,
            controls_params: {},
            self: null,
            Load: (total_height) => {
               Demo_animations_ready_button_with_panel(ROOT_WIDGETS.CREATE_ROOT, 0, total_height);
            },
            LoadControls: null,
         },
         {
            name: 'Animations1', id: bit <<= 0x1, idx: 1,
            controls_params: {},
            self: null,
            Load: (total_height) => {
               Demo_animations(100, total_height);
            },
            LoadControls: null,
         },
         {
            name: 'Animations2', id: bit <<= 0x1, idx: 2,
            controls_params: {},
            self: null,
            Load: (total_height) => {
               Demo_animations_with_slider_slope(0, total_height);
            },
            LoadControls: null,
         },
         {
            name: 'AnimationsText', id: bit <<= 0x1, idx: 3,
            controls_params: {},
            self: null,
            Load: (total_height) => {
               return Demo_animations_text(0, total_height, false);
            },
            LoadControls: null,
         },
         {
            name: 'Rotating Rectangles', id: bit <<= 0x1, idx: 4,
            controls_params: {},
            self: null,
            Load: (total_height) => {
               Board_rotations(0, total_height, ROOT_WIDGETS.CREATE_ROOT);
            },
            LoadControls: null,
         },

      ],
      id: bit <<= 0x1,
      idx: demos_index_cnt++,
   },
   { // [3]: In Practise
      name: 'In Practise',
      sub_cat: [
         {
            name: 'Snake', id: bit <<= 0x1, idx: 0, Load: () => { },
            controls_params: {},
            self: null,
            Load: (total_height) => {
               return Game_snake(total_height, false);
            },
            LoadControls: (self, controls_params) => { },
         },
         {
            name: 'Tetris', id: bit <<= 0x1, idx: 1, Load: () => { },
            controls_params: null,
            self: null,
            Load: (total_height) => {
               Tetris_reset();
               Tetris(ROOT_WIDGETS.CREATE_ROOT, 0, total_height, true, demos_index_cnt, 1);
               return null;
            },
            LoadControls: null,
         },
         {
            name: 'Arkanoid', id: bit <<= 0x1, idx: 2,
            controls_params: null,
            self: null,
            Load: () => {
               Arkanoid_reset();
               Arkanoid_initialize();
               return null;
            },
            LoadControls: null,
         },
      ],
      id: bit <<= 0x1,
      idx: demos_index_cnt++,
   },
];



// TODO: Implement an automatic way to construct the object bellow that connects the naming for accesing any demo from '_demo_categories_buffer'
const demo_categories = {
   widgets: { 
      name: 'Widgets', id: _demo_categories_buffer[0].id, idx: _demo_categories_buffer[0].idx 
   },
   text_rendering: { 
      name: 'Text Render', id: _demo_categories_buffer[1].id, idx: _demo_categories_buffer[1].idx 
   },
   particles: {
      name: 'Particles', id: _demo_categories_buffer[2].id, idx: _demo_categories_buffer[2].idx,
      comet: { name: 'Comet', id: _demo_categories_buffer[2].sub_cat[0].id, idx: 0 },
      glow: { name: 'Glow', id: _demo_categories_buffer[2].sub_cat[1].id, idx: 1 },
      smoke: { name: 'Smoke', id: _demo_categories_buffer[2].sub_cat[2].id, idx: 2 },
      explosion: { name: 'Explosion', id: _demo_categories_buffer[2].sub_cat[3].id, idx: 3 },
      sparkles: { name: 'Sparkles', id: _demo_categories_buffer[2].sub_cat[4].id, idx: 4 },
   },
   physics: {
      name: 'Physics', id: _demo_categories_buffer[3].id, idx: _demo_categories_buffer[3].idx,
      elastic_colisions: { name: 'Elastic Collisions', id: _demo_categories_buffer[3].sub_cat[0].id, idx: 0 },
      perimetric_rotation: { name: 'Perimetric Rotation', id: _demo_categories_buffer[3].sub_cat[1].id, idx: 1 },
      velocity_vertlet: { name: 'Velocity Verlet', id: _demo_categories_buffer[3].sub_cat[2].id, idx: 2 },

   },
   animations: {
      name: 'Animations', id: _demo_categories_buffer[4].id, idx: _demo_categories_buffer[4].idx,
      animations_button: { name: 'Button Animations', id: _demo_categories_buffer[4].sub_cat[0].id, idx: 0 },
      animations_1: { name: 'Animations1', id: _demo_categories_buffer[4].sub_cat[1].id, idx: 1 },
      animations_2: { name: 'Animations2', id: _demo_categories_buffer[4].sub_cat[2].id, idx: 2 },
      animations_text: { name: 'AnimationsText', id: _demo_categories_buffer[4].sub_cat[3].id, idx: 3 },
      animations_rotating_rects: { name: 'Rotating Rectangles', id: _demo_categories_buffer[4].sub_cat[4].id, idx: 4 },
   },
   in_practise: {
      name: 'In Practise', id: _demo_categories_buffer[5].id, idx: _demo_categories_buffer[5].idx,
      snake: { name: 'Snake', id: _demo_categories_buffer[5].sub_cat[0].id, idx: 0 },
      tetris: { name: 'Tetris', id: _demo_categories_buffer[5].sub_cat[1].id, idx: 1 },
      arkanoid: { name: 'Arkanoid', id: _demo_categories_buffer[5].sub_cat[2].id, idx: 2 },

   },
};



// function Bind_menu_button(btn, params, any_id, id, Unload_clbk_buffer = null) {
function Bind_menu_button(btn, params, category_idx, sub_category_idx, Unload_clbk_buffer = null) {

   btn.Bind(
      (params) => {

         const loaded_category_idx = params.params.mnemonics.category_idx;
         const loaded_sub_category_idx = params.params.mnemonics.sub_category_idx;

         if (loaded_category_idx !== category_idx || loaded_sub_category_idx !== sub_category_idx) {

            if (Unload_clbk_buffer) {

               const len = Unload_clbk_buffer.length;
               for (let i = 0; i < len; i++) {

                  const unload_clbk = Unload_clbk_buffer[i];
                  if (unload_clbk && unload_clbk !== undefined) unload_clbk();
               }
            }

            App_reset(); // Reset all 
            Scene_camera_scroll_set(_, 0);
            App_reinitialize();

            // Create new page
            Demo_page(category_idx, sub_category_idx);
            params.params.mnemonics.category_idx = category_idx;
            params.params.mnemonics.sub_category_idx = sub_category_idx;
         }
         return false;
      }, _, { mnemonics: params.mnemonics, Unload_clbk_buffer: Unload_clbk_buffer }, _,
   );
}








export function Demos_welcome_menu() {


   const dim = [
      (VIEWPORT.WIDTH / 2 >= 180) ? 180 : VIEWPORT.WIDTH / 2 - 10,
      (VIEWPORT.HEIGHT / 2 >= 250) ? 250 : VIEWPORT.HEIGHT / 2 - 10,
   ];

   let zpos = 10;
   const r_corners = 12;

   // const menu_panel = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, _, [0,30], [VIEWPORT.WIDTH/2-dim[0], VIEWPORT.HEIGHT/2-dim[1], 10], dim, TRANSPARENCY(GREY[3], .9), 'section', );
   const menu_panel = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [20, 20], pos: [VIEWPORT.WIDTH / 2, VIEWPORT.HEIGHT / 2, 10], col: TRANSPARENCY(GREY[3], .9), name: 'MenuLoadPanel', }));
   Widget_gfx_ready_enable({ mesh: menu_panel, enable_sdf_rect: r_corners, listener: { type: LISTEN_EVENT_TYPES.MOVE } });

   zpos++;




   /*************************************************************************************************/
   // Menu Options


   // Calculate dimentions for small width device
   const dif = Abs((VIEWPORT.WIDTH / 2 - 10) - dim[0]);
   let log = (dif > 0) ? Math.log(dif) : .2;
   (log > 1) ? log = 1 : log = log;
   const pad = (30 * log)

   const btn_col = TRANSPARENCY(GREEN[5], .8);
   const tr = .3;
   const col_inner = GREY[0];

   // const welcome_panel = Create_rect_mesh(_, _, [0,30], [VIEWPORT.WIDTH/2-dim[0], VIEWPORT.HEIGHT/2-dim[1], 10], dim, TRANSPARENCY(GREY[5], .9), 'section', );
   const welcome_panel = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 10], col: TRANSPARENCY(GREEN[5], .9), name: 'section', }));
   Widget_gfx_ready_enable({ mesh: menu_panel, enable_sdf_rect: r_corners, });
   menu_panel.AddItem(welcome_panel);

   {
      const col = BLUEL[7];
      // const welcome = Create_widget_label(_, 'Welcome,', _, _, _, TRANSPARENT, WHITE, [11, 6], _, _, TEXTURES.CONSOLAS_32px);
      const welcome = Create_widget_label(Style_label_default_properties({ text: 'Welcome', col: TRANSPARENT, text_pad: [11, 0], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 50 }));
      Widget_gfx_ready_enable({ mesh: menu_panel, enable_sdf_rect: 31, });
      welcome_panel.AddItem(welcome);
   }

   {
      const text = `to my WebGL Portfolio.
This project showcases my custom WebGL rendering engine,
designed to produce mainly 2D graphics, as well as 3D,
interactive UI widgets, simple dynamic particle system,
and simple animations.
It's a testament to my passion for graphics programming
and my dedication to performance-driven design.
Explore the demos and discover the possibilities!`;
      const col = GREY[7];
      const welcome = Create_widget_label(Style_label_default_properties({ text: text, col: TRANSPARENCY(col, .1), text_pad: [11, 0], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 50 }));
      Widget_gfx_ready_enable({ mesh: menu_panel, enable_sdf_rect: 12, });
      welcome_panel.AddItem(welcome);

   }


   welcome_panel.options = SECTION.RESIZE_PARENT | SECTION.VERTICAL;
   // welcome_panel.options = SECTION.RESIZE_PARENT|SECTION.VERTICAL|SECTION.INHERIT|SECTION.HORIZONTAL_CENTER;




   /*******************************************************************************************/
   // Start Game button
   const close_btn = Create_widget_close_btn(Style_button_default_properties({ text: 'CLOSE', target_mesh: menu_panel, pos: [0, 0, zpos], col: ORANGER[8], text_pad: [dim[0] / 2 - pad * 2, 6], font_size: 24, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, layout: LAYOUT.VERTICAL }));
   Widget_gfx_ready_enable({ mesh: close_btn, enable_sdf_rect: close_btn.geom.dim[1], listener: { type: LISTEN_EVENT_TYPES.HOVER } })
   menu_panel.AddItem(close_btn);


   /*************************************************************************************************/
   // Render Menu 
   // menu_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC, menu_panel.mesh_bufferidx, true);
   menu_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, menu_panel.mesh_bufferidx, true);
   menu_panel.GenGfxCtx();
   Align_nested_sections_pre(menu_panel);
      
   Vertex_buffer_calculate_render_group_starts();
   View_render_from_view_NEW(menu_panel.group_bufferidxs[0]);


   Root_group_activate_all_vbs_in_renderqueue(menu_panel.root_bufferidx);
   Construct_listen_events_from_mesh_tree(menu_panel);
   Construct_listen_events_relations_from_mesh_tree(menu_panel);

   menu_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, menu_panel.gfx.vb.groupidx);

   // Set menu in focus
   Mesh_set_root_in_focus(menu_panel.root_bufferidx, menu_panel.scroller_comp_idx);


   // Create event callback for the close menu button
   const evt_clbk_params = {
      evt_clbks: () => {
         Demo_page();
      },
   }

   Mesh_event_callback_create(menu_panel, evt_clbk_params);

}


// export function Demo_page(category_idx = demo_categories.in_practise.idx, sub_category_idx = demo_categories.in_practise.arkanoid.idx) {
// export function Demo_page(category_idx = demo_categories.particles.idx, sub_category_idx = demo_categories.particles.smoke.idx) {
// export function Demo_page(category_idx = demo_categories.particles.idx, sub_category_idx = demo_categories.particles.glow.idx) {
// export function Demo_page(category_idx = demo_categories.particles.idx, sub_category_idx = demo_categories.particles.sparkles.idx) {
export function Demo_page(category_idx = demo_categories.physics.idx, sub_category_idx = demo_categories.physics.elastic_colisions.idx) {
// export function Demo_page(category_idx = demo_categories.animations.idx, sub_category_idx = demo_categories.animations.animations_button.idx) {
// export function Demo_page(category_idx = demo_categories.animations.idx, sub_category_idx = demo_categories.animations.animations_rotating_rects.idx) {
// export function Demo_page(category_idx = demo_categories.physics.idx, sub_category_idx = demo_categories.physics.elastic_colisions.idx) {

   const demo = _demo_categories_buffer[category_idx].sub_cat[sub_category_idx];

   const pad = 10;
   const rcorners = 10;

   /****************************************************************************************************************************************************/
   // Create the load demo button
   const menu_layout = LAYOUT.FIXED_WIDTH | LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_HORIZONTAL;
   // const window_menu = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [pad, pad], dim: [VIEWPORT.WIDTH / 2 - pad - 1, 0], col: TRANSPARENCY(GREY[5], .4), layout: menu_layout, name: 'window_menu' }));
   const window_menu = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [pad, pad], dim: [VIEWPORT.WIDTH / 2 - pad - 1, 0], col: COLOR_THEME_BASIC.GREY_DARK_BASE, layout: menu_layout, name: 'window_menu' }));
   Widget_gfx_ready_enable({ mesh: window_menu, enable_sdf_rect: 4, listener: { type: LISTEN_EVENT_TYPES.CLICK_UP } });

   Scene_store_window_resized_meshes(window_menu.mesh_bufferidx);

   const text_pad = [16, 10];
   const font_size = 10;


   /*******************************************************************************************/
   // Load menu button
   // const Load_menu_btn = Create_widget_button(Style_button_default_properties({ text: 'Demos', pos: [0, 0, 1], col: GREEN[7], text_pad: text_pad, font_size: font_size }));
   const Load_menu_btn = Create_widget_button(Style_button_default_properties({ text: 'Demos', pos: [0, 0, 1], col: COLOR_THEME_BASIC.BLUE_LIGHT, text_pad: text_pad, font_size: font_size }));
   Widget_gfx_ready_enable({ mesh: Load_menu_btn, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
   window_menu.AddItem(Load_menu_btn);

   // Setup Load Menu Panel callback on lod button click
   const load_clbk_params = {

      menu_panel: null, // A pointer to the future created menu panel
      Create_menu_items_clbk: Create_menu_items_demo_categories,
      mnemonics: { category_idx: category_idx, sub_category_idx: sub_category_idx }, // Remember variable values between different pages
   };

   Load_menu_btn.Bind(
      Create_menu_popup,
      _, load_clbk_params, _,
   );


   /*******************************************************************************************/
   // Local sub-category dropdown menu
   const sub_category_buttons_panel = Create_widget_dropdown(Style_dropdown_default_properties({ text: `Menu`, pos: [0, 0, 0], col: GREY[3], menu_col: GREY[5], btn_col: GREY[2], text_col: WHITE, pad: [5, 5], text_pad: [text_pad[0] - 5, text_pad[1] - 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.EXPAND }));
   Widget_gfx_ready_enable({ mesh: sub_category_buttons_panel, enable_sdf_rect: 10 })
   Dropdown_roots_set_root(sub_category_buttons_panel, sub_category_buttons_panel);
   window_menu.AddItem(sub_category_buttons_panel);

   const buttons_panel = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], col: TRANSPARENCY(GREY[1], .9), name: 'buttons_panel', }));
   Widget_gfx_ready_enable({ mesh: buttons_panel, enable_sdf_rect: buttons_panel.geom.dim[0] / 10 });
   sub_category_buttons_panel.AddToMenu(buttons_panel);


   const params = {

      menu_panel: buttons_panel, // A pointer to the future created menu panel
      btn_col: BLUEL[9],
      text_col: GREY[1],
      mnemonics: { category_idx: category_idx, sub_category_idx: sub_category_idx }, // Remember variable values between different pages
   };
   const menu_buttons = Create_menu_items_demo_sub_categories(params, category_idx, sub_category_idx);
   for (let i = 0; i < menu_buttons.length; i++) {
      buttons_panel.AddItem(menu_buttons[i]);
   }


   /*******************************************************************************************/
   /*******************************************************************************************/
   /*******************************************************************************************/
   // 
   let total_height = 65;
   const info_ui = Debug_info_ui_static(ROOT_WIDGETS.CREATE_ROOT, 0, total_height);
   total_height += info_ui.geom.dim[1]; // Space for the debug_info ui
   total_height += 10; // Space for the debug_info ui


   const self = demo.Load(total_height, demo.controls_params);
   demo.self = self;
   console.log('Demo:', demo.name, 'Controls:', demo.controls)
   total_height += 20;




   /*******************************************************************************************/
   // Options menu button

   const options_menu_btn = Create_widget_button(Style_button_default_properties({ text: 'Options', pos: [0, 0, 1], col: GREENR[7], text_pad: text_pad, font_size: font_size }));
   Widget_gfx_ready_enable({ mesh: options_menu_btn, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
   window_menu.AddItem(options_menu_btn);

   // Setup Load Menu Panel callback on load button click
   const options_clbk_params = {

      menu_panel: null, // A pointer to the future created menu panel
      mnemonics: {
         category_idx: category_idx,
         sub_category_idx: sub_category_idx,
         demo_controls_params: demo.controls_params,
      }, // Remember variable values between different pages
   };

   options_menu_btn.Bind(
      Options_menu_callback,
      _, options_clbk_params, _,
   );



   /*******************************************************************************************/
   // Render Menu Bar
   {
      window_menu.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.ABSOLUTE_POSITION, _, true);

      
      window_menu.GenGfxCtx();
      
      Align_nested_sections_pre(window_menu);

      Vertex_buffer_calculate_render_group_starts();
      View_render_from_view_NEW(window_menu.group_bufferidxs[0]);

      Root_group_activate_all_vbs_in_renderqueue(window_menu.root_bufferidx);

      window_menu.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, window_menu.gfx.vb.groupidx)

      Construct_listen_events_from_mesh_tree(window_menu)
      Construct_listen_events_relations_from_mesh_tree(window_menu);

   }



   /****************************************************************************************************************************************************/
   { // Create the button for going to the top

      // const btn = Create_widget_button(Style_button_default_properties({
      //    is_root:ROOT_WIDGETS.CREATE_ROOT, 
      //    text:'^', 
      //    pos:[VIEWPORT.RIGHT - 100, VIEWPORT.BOTTOM - 80, 10], 
      //    text_col:GREY[4], col:GREEN[9], text_pad:[12, 7], 
      //    // texture_id:TEXTURES.MTSDF_SYMBOLS, sub_texture_id:ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow2_up, 
      // }));
      const size = 40;
      const btn = Create_rect_mesh(Style_rect_default_properties({
         is_root: ROOT_WIDGETS.CREATE_ROOT,
         name: '^',
         pos: [VIEWPORT.RIGHT - size * 2, VIEWPORT.BOTTOM - size * 2, 10], dim: [size, size],
         text_col: GREY[4], col: GREEN[6], text_pad: [12, 7],
         texture_id: TEXTURES.MTSDF_SYMBOLS, sub_texture_id: ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow2_up, fonts_size: 30,
      }));
      Widget_gfx_ready_enable({ mesh: btn, enable_sdf_rect: btn.geom.dim[1], listener: { type: LISTEN_EVENT_TYPES.HOVER } });

      btn.Bind(
         () => {

            Callback_animations_create( // Scroll Up
               () => { // Run Animation

                  const unif_wpos = Screen_wpos_get_y();
                  if (unif_wpos < 0) {

                     const ypos = unif_wpos / 2;
                     Scene_camera_scroll_add(_, -ypos / 2);
                     return true;
                  }

                  return false;
               },
               () => { // Stop Animation
                  return false;
               },
            );
         },
         _, _, _,
      );

      btn.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.ABSOLUTE_POSITION | GFX_CTX_FLAGS.FROM_ROOT_WIDGET;
      btn.GenGfxCtx();
      
      Vertex_buffer_calculate_render_group_starts();
      View_render_from_view_NEW(btn.group_bufferidxs[0]);

      Root_group_activate_all_vbs_in_renderqueue(btn.root_bufferidx);

      btn.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, btn.gfx.vb.groupidx)

      Construct_listen_events_from_mesh_tree(btn)
      Construct_listen_events_relations_from_mesh_tree(btn);

      Listeners_set_priority(E.C, btn.listeners);

   }


   // Set focus
   Mesh_set_root_in_focus(info_ui.root_bufferidx);
   Mesh_set_root_in_focus(window_menu.root_bufferidx);

}



/**This is a generic function for creating this type of menu. The menu items are created from a callback function passed in 'params' from the caller function */
function Create_menu_popup(params) {

   if (params.params.menu_panel !== null) return;

   const dim = [
      (VIEWPORT.WIDTH / 2 >= 180) ? 180 : VIEWPORT.WIDTH / 2 - 10,
      (VIEWPORT.HEIGHT / 2 >= 250) ? 250 : VIEWPORT.HEIGHT / 2 - 10,
   ];

   let zpos = 10;

   const menu_panel = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [30, 30], pos: [VIEWPORT.WIDTH / 2 - dim[0], VIEWPORT.HEIGHT / 2 - dim[1], 10], dim: dim, col: TRANSPARENCY(COLOR_THEME_BASIC.GREY_DARK_BASE, .9), name: 'MenuLoadPanel', }));
   Widget_gfx_ready_enable({ mesh: menu_panel, enable_sdf_rect: menu_panel.geom.dim[0] / 10, listener: { type: LISTEN_EVENT_TYPES.CLICK_UP } });
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) Mesh_listener_create(menu_panel, LISTEN_EVENT_TYPES.MOVE);

   params.params.menu_panel = menu_panel;

   zpos++;




   /*************************************************************************************************/
   // Menu Options

   const btn_col = TRANSPARENCY(GREY[1], .8);

   // Calculate dimentions for small width device
   const dif = Abs((VIEWPORT.WIDTH / 2 - 10) - dim[0]);
   let log = (dif > 0) ? Math.log(dif) : .2;
   (log > 1) ? log = 1 : log = log;
   const pad = (20 * log)



   // Setup Load Menu Panel callback on lod button click
   const load_clbk_params = {
      // mnemonics: params.params.mnemonics, // Remember variable values between different pages

      // Remember variable values between different pages
      mnemonics: {
         category_idx: params.params.mnemonics.category_idx,
         sub_category_idx: params.params.mnemonics.sub_category_idx,
      }
   };
   const menu_items = params.params.Create_menu_items_clbk(load_clbk_params);
   const len = menu_items.length;
   for (let i = 0; i < len; i++) {
      menu_panel.AddItem(menu_items[i]);
   }






   /*******************************************************************************************/
   // Close button
   const close_btn = Create_widget_close_btn(Style_button_default_properties({ text: 'CLOSE', target_mesh: menu_panel, pos: [0, 0, zpos], col: close_btn_col, text_pad: [dim[0] / 2 - pad * 2, 6], font_size: 15, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, layout: LAYOUT.VERTICAL }));
   Widget_gfx_ready_enable({ mesh: close_btn, enable_sdf_rect: close_btn.geom.dim[1], listener: { type: LISTEN_EVENT_TYPES.HOVER } })
   menu_panel.AddItem(close_btn);




   /*************************************************************************************************/
   // Render Menu 
   menu_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);
   menu_panel.GenGfxCtx();
   Align_nested_sections_pre(menu_panel);
   Align_expand(menu_panel);
      
   Vertex_buffer_calculate_render_group_starts();
   View_render_from_view_NEW(menu_panel.group_bufferidxs[0]);

   Root_group_activate_all_vbs_in_renderqueue(menu_panel.root_bufferidx);
   Construct_listen_events_from_mesh_tree(menu_panel);
   Construct_listen_events_relations_from_mesh_tree(menu_panel);

   menu_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, menu_panel.gfx.vb.groupidx);

   // Set menu in focus
   Mesh_set_root_in_focus(menu_panel.root_bufferidx, menu_panel.scroller_comp_idx);


   // Create event callback for the close menu button
   const evt_clbk_params = {
      evt_clbks: () => { params.params.menu_panel = null; },
   }

   Mesh_event_callback_create(menu_panel, evt_clbk_params);
}




function Options_menu_callback(params) {


   if (params.params.menu_panel !== null)
      return;

   const dim = [
      (VIEWPORT.WIDTH / 2 >= 180) ? 180 : VIEWPORT.WIDTH / 2 - 10,
      (VIEWPORT.HEIGHT / 2 >= 250) ? 250 : VIEWPORT.HEIGHT / 2 - 10,
   ];

   let zpos = 10;



   /*************************************************************************************************/
   // Menu Options

   const btn_col = TRANSPARENCY(GREY[1], .8);
   const tr = .7;

   // Calculate dimentions for small width device
   const dif = Abs((VIEWPORT.WIDTH / 2 - 10) - dim[0]);
   let log = (dif > 0) ? Math.log(dif) : .2;
   (log > 1) ? log = 1 : log = log;
   const pad = (20 * log);


   const menu_panel = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [0, 0], pos: [VIEWPORT.WIDTH / 2 - dim[0], VIEWPORT.HEIGHT / 2 - dim[1], 10], dim: dim, col: TRANSPARENCY(GREY[3], tr), name: 'MenuOptionsPanel', }));
   // const menu_panel = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [0, 0], pos: [VIEWPORT.WIDTH / 2 - dim[0], VIEWPORT.HEIGHT / 2 - dim[1], 10], dim: [800, 200], col: TRANSPARENCY(GREY[3], tr), name: 'MenuOptionsPanel', }));
   // const menu_panel = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [0, 0], pos: [0, 0, 10], dim: dim, col: TRANSPARENCY(GREY[3], tr), name: 'MenuOptionsPanel', }));
   // const menu_panel = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [0, 0, 10], dim: dim, col: Color_hsv_to_rgb_calibrated(0, 0, 1, tr, .18, 0), name: 'MenuOptionsPanel', }));
   Widget_gfx_ready_enable({ mesh: menu_panel, enable_sdf_rect: menu_panel.geom.dim[0] / 10, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.CLICK_UP } });
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) Mesh_listener_create(menu_panel, LISTEN_EVENT_TYPES.MOVE);

   params.params.menu_panel = menu_panel;


   let controls_section = null;


   const rcorners = 10;
   const slider_section = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 1], col: Color_hsv_to_rgb_calibrated(0, 0, 1, tr, .28, 0), name: 'SliderSection', }));
   Widget_gfx_ready_enable({ mesh: slider_section, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.MOVE } });


   slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, slider_section.mesh_bufferidx, true);
   slider_section.gfx_ctx_flags &= ~GFX_CTX_FLAGS.PRIVATE;
   slider_section.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;


   const category_idx = params.params.mnemonics.category_idx;
   const sub_category_idx = params.params.mnemonics.sub_category_idx;
   const demo = _demo_categories_buffer[category_idx].sub_cat[sub_category_idx];

   const layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
   // const grow_section_1 = Create_rect_mesh(Style_rect_default_properties({ pad: [pad, pad], dim: [0, 0], col: Color_hsv_to_rgb_calibrated(0, 0, 1, 1, .38, 0), layout: layout_vert, name: 'grow_section_1' }));
   const grow_section_1 = Create_rect_mesh(Style_rect_default_properties({ pad: [20, pad], dim: [200, 200], col: Color_hsv_to_rgb_calibrated(0, 0, 1, 1, .38, 0), layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF, name: 'grow_section_1' }));
   Widget_gfx_ready_enable({ mesh: grow_section_1, enable_sdf_rect: rcorners });
   menu_panel.AddItem(grow_section_1);

   if (demo.LoadControls) {

      const controls = demo.LoadControls(demo.self, demo.controls_params);
      const controls_len = controls.length;
      for (let i = 0; i < controls_len; i++) {
         grow_section_1.AddItem(controls[i]);
      }
   }






   /*******************************************************************************************/
   // Create close button

   const grow_section_2 = Create_rect_mesh(Style_rect_default_properties({ pad: [pad, pad], dim: [0, 0], col: TRANSPARENT, layout: layout_vert, name: 'grow_section_2' }));
   Widget_gfx_ready_enable({ mesh: grow_section_2, enable_sdf_rect: rcorners });
   menu_panel.AddItem(grow_section_2);

   const close_btn = Create_widget_close_btn(Style_button_default_properties({ text: 'CLOSE', target_mesh: menu_panel, pos: [0, 0, zpos], col: close_btn_col, text_pad: [dim[0] / 2 - pad * 2, 6], font_size: 15, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, layout: LAYOUT.HORIZONTAL, }));
   Widget_gfx_ready_enable({ mesh: close_btn, enable_sdf_rect: close_btn.geom.dim[1], listener: { type: LISTEN_EVENT_TYPES.HOVER } });
   // grow_section_2.align.proportion.y = .5;
   grow_section_2.AddItem(close_btn);





   /*************************************************************************************************/
   // Render menu panel

   // Layout_calculate_grow_children_count_layout(menu_panel);
   // Align_pre_simple___with_grow_containers(menu_panel);
   Align_nested_sections_pre(menu_panel);
   Align_expand(menu_panel);

   // menu_panel.geom.pos[0] = VIEWPORT.WIDTH / 2 - dim[0];
   // menu_panel.geom.pos[1] = VIEWPORT.HEIGHT / 2 - dim[1];

   menu_panel.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, false);
   menu_panel.GenGfxCtx();

   // Build a group view of the scrolled section for the scroller
   if (controls_section !== null) {

      View_build_group_from_root_mesh(controls_section);
      Align_nested_sections_pre(controls_section);
      // const center = (menu_panel.geom.dim[0] - controls_section.geom.dim[0]);
      // controls_section.MoveNoGfxUpdate(center, ypos); ypos += controls_section.geom.dim[1] * 2 + 10;

   }
      
   Vertex_buffer_calculate_render_group_starts();
   View_render_from_view_NEW(menu_panel.group_bufferidxs[0]);


   Root_group_activate_all_vbs_in_renderqueue(menu_panel.root_bufferidx);
   Construct_listen_events_from_mesh_tree(menu_panel);
   Construct_listen_events_relations_from_mesh_tree(menu_panel);


   menu_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, menu_panel.gfx.vb.groupidx);
   if (controls_section !== null) controls_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, controls_section.gfx.vb.groupidx);

   Listeners_set_priority(E.C, close_btn.listeners);


   // Create scroller
   const clean_height = menu_panel.geom.dim[1] - (close_btn.geom.dim[1] * 2 + 10);
   const needs_scroller = (controls_section !== null) ? (controls_section.geom.dim[1] > clean_height) ? true : false : false;
   if (needs_scroller) {

      const scroller_height = menu_panel.geom.dim[1] - (close_btn.geom.dim[1] * 2 + 10);
      const scroller_component = Components_create_scroller_component(10, scroller_height, controls_section,);
      Scoller_component_gengfx_and_render(scroller_component, controls_section, GFX_CTX_FLAGS.ABSOLUTE_POSITION);
      Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(controls_section.root_posidx, scroller_component.root_posidx);
      Listeners_set_priority(E.C, scroller_component.listeners);
      menu_panel.AddChildScrollerIdx(controls_section.scroller_comp_idx);

      Scroller_component_calculate_handle_pos_dim(scroller_component);


      /**************************************************************************************************************************/
      // Set scissor box
      const mx = controls_section.mesh_bufferidx;
      const my = scroller_component.mesh_bufferidx;
      const mw = controls_section.mesh_bufferidx;
      const mh = scroller_component.mesh_bufferidx;
      Vertex_buffer_group_create_scissorbox(controls_section.gfx.vb.groupidx, mx, my, mw, mh);

      // Unfortunately must Re-render the menu_panel for the clipping of the scroller to take place
      Root_group_reset_gfxs(controls_section.root_bufferidx);
      Root_group_rerender_from_root_reconstruct_listeners(controls_section.root_bufferidx);

      Renderqueue_set_active(scroller_component.gfx.vb.groupidx, true);

   }




   // Set menu in focus
   Mesh_set_root_in_focus(menu_panel.root_bufferidx, menu_panel.scroller_comp_idx);

   // Create event callback for the close menu button to run
   const evt_clbk_params = {
      evt_clbks: (clbk_params) => {
         clbk_params.menu_panel = null; // Set menu_panel to null so the contols will be re-created ('Options_menu_callback' checks if menu_panel is null to create a new options menu)
         const demo = _demo_categories_buffer[clbk_params.mnemonics.category_idx].sub_cat[clbk_params.mnemonics.sub_category_idx];
         demo.controls_params = clbk_params.mnemonics.demo_controls_params;
      },
      params: params.params,
   }

   Mesh_event_callback_create(menu_panel, evt_clbk_params);
}




/**This is the callback function to create specific menu items. */
function Create_menu_items_demo_categories(params) {


   const menu_items_array = [];

   /*************************************************************************************************/
   // Menu Items

   const rcorners = 8;
   const font = TEXTURES.MTSDF_CONSOLAS_1024;
   const text_col = params.text_col;
   const text_pad = [15, 8];
   const font_size = 10;
   const btn_col = params.btn_col;


   const len = _demo_categories_buffer.length;
   for (let i = 0; i < len; i++) {

      const category = _demo_categories_buffer[i];

      const item_btn = Create_widget_button(Style_button_default_properties({
         theme: Color_theme_label_auto(.58, 1., .03, .0),
         text: category.name, align: TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER,
         pos: [0, 0, 0], col: btn_col, text_col: text_col, text_pad: text_pad,
         texture_id: font, font_size: font_size, layout: LAYOUT.VERTICAL|LAYOUT.EXPAND
      }));
      Widget_gfx_ready_enable({ mesh: item_btn, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
      menu_items_array.push(item_btn);

      // TODO: Add button animations

      const sub_category_idx = 0; // Load the first suub category demo of the chosen demo category
      Bind_menu_button(item_btn, params, category.idx, sub_category_idx); // Pass the current button's category and sub category indexes

   }

   return menu_items_array;
}




function Create_menu_items_demo_sub_categories(params, category_idx, sub_category_idx) {

   const menu_items_array = [];

   /*************************************************************************************************/
   // Menu Items
   const rcorners = 8;
   const font = TEXTURES.MTSDF_CONSOLAS_1024;
   const text_col = params.text_col;
   const btn_col = params.btn_col;
   const text_pad = [15, 8];
   const font_size = 10;

   const category = _demo_categories_buffer[category_idx];
   const len = category.sub_cat.length;
   for (let i = 0; i < len; i++) {

      const sub_category = category.sub_cat[i];

      const activated_color =
         (sub_category.idx === sub_category_idx) ? new Float32Array([btn_col[0] * .4, btn_col[1] * .4, btn_col[2] * .4, 1]) : btn_col;

      const item_btn = Create_widget_button(Style_button_default_properties({
         theme: Color_theme_label_auto(.58, 1., .08, .0),
         text: sub_category.name, align: TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER,
         pos: [0, 0, 0], col: activated_color, text_col: text_col, text_pad: text_pad,
         texture_id: font, font_size: font_size, layout: LAYOUT.VERTICAL|LAYOUT.EXPAND
      }));

      Widget_gfx_ready_enable({ mesh: item_btn, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
      menu_items_array.push(item_btn);

      Bind_menu_button(item_btn, params, category.idx, sub_category.idx); // Pass the current button's category and sub category indexes
   }


   return menu_items_array;
}





