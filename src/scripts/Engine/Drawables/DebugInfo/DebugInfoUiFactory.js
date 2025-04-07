"use strict";

import { Widget_gfx_ready_enable } from "../../../App/Widgets/WidgetGfxReady.js";
import { Create_rect_mesh, Create_widget_label, Create_widget_switch_simple } from "../../Core/CreateWidget.js";
import { Relative_pos_comp_create_new_comp } from "../Operations/RelativePosComponent.js";
import { Style_label_default_properties, Style_rect_default_properties, Style_switch_default_properties } from "../Widgets/WidgetReadyStyles.js";


export function Ui_create_label_switch(name, font_size, switch_size, switch_fn, callback_params, section_col, label_col, label_text_col, switch_col, switch_col2, section_pad, label_pad, switch_pad, label_style, zindex){

   const rcorners = 4;

   const section = Create_rect_mesh(Style_rect_default_properties({is_root:_, name:`DBG_UI ${name}`, pad:section_pad, pos:[0, 0, zindex + 1], dim:[0,0], col:section_col, layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF}));
   Widget_gfx_ready_enable({mesh:section, enable_sdf_rect:rcorners,});
   section.SetName(`DBG_UI ${name}`);
   section.rel_comp = Relative_pos_comp_create_new_comp();
   
   const label = Create_widget_label(Style_label_default_properties({is_root:_, text:`${name}`, align:(ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), pos:[0, 0, zindex + 2], font_size:font_size, col:label_col, text_col:label_text_col, text_pad:label_pad, style:label_style, }));
   Widget_gfx_ready_enable({mesh:label, enable_sdf_rect:rcorners,});
   section.AddItem(label);
   
   const ui_switch = Create_widget_switch_simple(Style_switch_default_properties({pos:[0, 0, zindex + 2], size:switch_size, col:switch_col, handle_col:switch_col2, pad:switch_pad, }));
   Widget_gfx_ready_enable({mesh:ui_switch, enable_sdf_rect:ui_switch.geom.dim[1],});
   ui_switch.SetName(`DBG_UI ${name} switch`);
   
   ui_switch.Bind(switch_fn, null, callback_params);
   section.AddItem(ui_switch);

   return section;
}