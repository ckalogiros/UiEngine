"use strict"

import { GREEN, GREY, TRANSPARENT, WHITE } from "../../../../Engine/Drawables/Material/Colors.js";
import { Layout_basic_pre_render } from "../../../../Engine/Drawables/Operations/AlignNestedSections.js";
import { Create_rect_mesh, Create_widget_label } from "../../../../Engine/Drawables/Widgets/Helpers/CreateWidgetInterface.js";
import { Style_label_default_properties, Style_rect_default_properties, Widget_gfx_ready_enable } from "../../../../Engine/Drawables/Widgets/Helpers/WidgetEnableProperties.js";
import { Widget_render } from "../../../../Engine/Drawables/Widgets/Helpers/WidgetRender.js";
import { Renderqueue_set_priority_by_vb } from "../../../../Engine/Renderers/Renderer/RenderQueue.js";
import { _arkanoid_struct } from "./Arkanoid.js";
import { COIN_SIZE, COIN_TEXTURE } from "./Coin.js";

export function Arkanoid_create_ui_menu(x, y, dimx, dimy) {

    let ypos = y;

    /***************************************************************************************************************/
    // Create score panel

    const menu = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [0, 0], pos: [x, ypos, 0], dim: [dimx, dimy], col: GREY[2], layout: LAYOUT.HORIZONTAL, name: 'Arkanoid-Menu' }));
    Widget_gfx_ready_enable({ mesh: menu, enable_sdf_rect: 10, enable_pass_vpos: true, listener: { type: LISTEN_EVENT_TYPES.CLICK_UP } });
    const control_values = [.7, .6, .8, 1.];
    menu.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
    menu.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);

    const pad_y = 10;
    const pad_x = 10;
    const pad = 10;
    // x = pad;
    // y = pad;

    // Score text
    const score_text = Create_widget_label(Style_label_default_properties({ text: 'score',  pad:[pad_x, pad_y], pos: [0, 0, 4], col: TRANSPARENT, font_size: 12, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, layout:LAYOUT.HORIZONTAL }));
    Widget_gfx_ready_enable({ mesh: score_text, enable_sdf_rect: 20, enable_pass_vpos: true });
    menu.AddItem(score_text);
    _arkanoid_struct.score_text = score_text;

    const score_num_text = Create_widget_label(Style_label_default_properties({ text: '000000000',  pad:[0, pad_y], pos: [0, 0, 4], col: TRANSPARENT, font_size: 12, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, layout:LAYOUT.HORIZONTAL }));
    Widget_gfx_ready_enable({ mesh: score_num_text, enable_sdf_rect: 20, enable_pass_vpos: true });
    menu.AddItem(score_num_text)
    _arkanoid_struct.score_num_text = score_num_text;

    // Coins counter
    const coins_texture = Create_rect_mesh(Style_rect_default_properties({ pad:[50, pad_y], pos: [0, 0, 4], col: WHITE, dim: [COIN_SIZE, COIN_SIZE], name: 'CoinCounterUi', texture_id: COIN_TEXTURE, layout: LAYOUT.HORIZONTAL }));
    Widget_gfx_ready_enable({ mesh: coins_texture, enable_sdf_rect: 20, enable_pass_vpos: true, });
    menu.AddItem(coins_texture);
    _arkanoid_struct.coins_texture = coins_texture;

    const coins_texture_text = Create_widget_label(Style_label_default_properties({ text: 'x000',  pad:[0, pad_y], pos: [0, 0, 4], col: TRANSPARENT, text_col: GREEN[9], font_size: 12, texture_id: TEXTURES.MTSDF_CONSOLAS_1024 }));
    Widget_gfx_ready_enable({ mesh: coins_texture_text, enable_sdf_rect: 20, enable_pass_vpos: true })
    menu.AddItem(coins_texture_text)
    _arkanoid_struct.coins_num_text = coins_texture_text;

    // Score modifier
    const score_mod_text = Create_widget_label(Style_label_default_properties({ text: 'score mod', pad:[pad_x, 0], pos: [0, 0, 4], col: TRANSPARENT, font_size: 12, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, layout: LAYOUT.VERTICAL}));
    Widget_gfx_ready_enable({ mesh: score_mod_text, enable_sdf_rect: 20, enable_pass_vpos: true });
    menu.AddItem(score_mod_text);
    _arkanoid_struct.score_mod_text = score_mod_text;

    const score_mod_num_text = Create_widget_label(Style_label_default_properties({ text: '00000', pad:[0, 0], pos: [0, 0, 0], col: TRANSPARENT, text_col: GREEN[9], font_size: 12, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, }));
    Widget_gfx_ready_enable({ mesh: score_mod_num_text, enable_sdf_rect: 20, enable_pass_vpos: true });
    menu.AddItem(score_mod_num_text)
    _arkanoid_struct.score_mod_num_text = score_mod_num_text;


    // Combo counter
    const combo_text = Create_widget_label(Style_label_default_properties({ text: 'combo',  pad:[50, 0], pos: [0, 0, 4], col: TRANSPARENT, font_size: 12, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, }));
    Widget_gfx_ready_enable({ mesh: combo_text, enable_sdf_rect: 20, enable_pass_vpos: true });
    menu.AddItem(combo_text);
    _arkanoid_struct.combo_text = combo_text;

    const combo_num_text = Create_widget_label(Style_label_default_properties({ text: 'x000',  pad:[0, 0], pos: [0, 0, 4], col: TRANSPARENT, text_col: GREEN[9], font_size: 12, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, }));
    Widget_gfx_ready_enable({ mesh: combo_num_text, enable_sdf_rect: 20, enable_pass_vpos: true })
    menu.AddItem(combo_num_text)
    _arkanoid_struct.combo_num_text = combo_num_text;

    // Render
    menu.GenGfxCtx();
    Layout_basic_pre_render(menu);
    Widget_render(menu);
    
    menu.GfxUniformSetAndUpdate('u_generic_controls', control_values); // Sdf-InnerShadow-Glow
    menu.GfxUniformsSetClbk('u_generic_controls', ()=>{ return control_values; }, menu.gfx.vb.groupidx);

    score_num_text.text_mesh.RenderTextFromNumber(0);
    score_mod_num_text.text_mesh.RenderTextFromNumber(0);
    coins_texture_text.text_mesh.RenderTextFromNumber(0);
    combo_num_text.text_mesh.RenderTextFromNumber(0);

    Renderqueue_set_priority_by_vb(LAST, coins_texture.gfx.vb.groupidx);

    return menu;
}