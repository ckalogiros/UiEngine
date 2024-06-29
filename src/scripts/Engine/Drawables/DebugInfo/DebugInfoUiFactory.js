"use strict";

import { Create_widget_label, Create_widget_section, Create_widget_switch_simple } from "../../Core/CreateWidget.js";
import { Relative_pos_comp_create_new_comp } from "../Operations/RelativePosComponent.js";


export function Dbg_ui_create2(name, fontsize, switch_size, switch_fn, callback_params, section_col, label_col, label_text_col, switch_col, switch_col2, section_pad, label_pad, switch_pad, label_style, zindex){

   const style = [0, 4, 2];
   const section = Create_widget_section(_, SECTION.HORIZONTAL, section_pad, [0, 0, zindex + 1], [0, 0], section_col, `DBG_UI ${name}`, label_style);
   section.SetName(`DBG_UI ${name}`);
   section.options = SECTION.HORIZONTAL | SECTION.EXPAND | SECTION.TOP_DOWN;
   // section.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;
   section.rel_comp = Relative_pos_comp_create_new_comp();
   
   const label = Create_widget_label(_, `${name}`, (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zindex + 2], fontsize, label_col, label_text_col, label_pad, _, label_style, _, _);
   section.AddItem(label);
   
   const ui_switch = Create_widget_switch_simple(_, [0, 0, zindex + 2], switch_size, switch_col, switch_col2, switch_pad, _, [6, 14, 2]);
   ui_switch.SetName(`DBG_UI ${name} switch`);
   
   // const callback_params = null; // Pass any params for the callback and get them at 'switch_fn' site
   ui_switch.Bind(switch_fn, null, callback_params);
   section.AddItem(ui_switch);

   return section;
}