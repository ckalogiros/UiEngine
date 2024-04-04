"use strict";

import { Create_widget_label, Create_widget_section, Create_widget_switch, Create_widget_switch_simple } from "../../Core/CreateWidget";
import { WHITE } from "../Material/Base/Colors";
import { REL_POS, Relative_pos_comp_add_child_to_comp, Relative_pos_comp_create_new_comp } from "../Operations/RelativePosComponent";


export function Dbg_ui_create(name, parent, fontsize, switch_size, switch_fn, section_col, label_col, label_text_col, switch_col, section_pad, label_pad, switch_pad, label_style, zindex){

   const section = Create_widget_section(_, SECTION.HORIZONTAL, section_pad, [0, 0, zindex + 1], [0, 0], section_col, `DBG_UI ${name}`);
   section.SetName(`DBG_UI ${name}`);
   section.options = SECTION.HORIZONTAL | SECTION.EXPAND | SECTION.TOP_DOWN;
   section.rel_comp = Relative_pos_comp_create_new_comp();

   
   const label = Create_widget_label(_, `DBG_UI ${name} label`, (ALIGN.BOTTOM | ALIGN.VERT_CENTER), [0, 0, zindex + 2], fontsize, TRANSPARENCY(label_col, 0), label_text_col, label_pad, _, label_style);
   const labelidx = section.AddItem(label);
   // Relative_pos_comp_add_child_to_comp(REL_POS.RIGHT, section, labelidx);
   
   // const ui_switch = Create_widget_switch(_, 'on', 'off', [0, 0, zindex + 2], fontsize, switch_col, WHITE, switch_pad);
   const ui_switch = Create_widget_switch_simple(_, [0, 0, zindex + 2], switch_size, switch_col, switch_pad);
   ui_switch.SetName(`DBG_UI ${name} switch`);
   
   const callback_params = null; // Pass any params for the callback and get them at 'switch_fn' site
   ui_switch.Bind(switch_fn, null, callback_params);
   const ui_switchidx = section.AddItem(ui_switch);
   Relative_pos_comp_add_child_to_comp(REL_POS.RIGHT, section, ui_switchidx);

   return section;
}