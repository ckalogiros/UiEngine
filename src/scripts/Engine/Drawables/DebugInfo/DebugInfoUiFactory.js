"use strict";

import { Create_widget_label, Create_widget_section, Create_widget_switch } from "../../Core/CreateWidget";


export function Dbg_ui_create(name, parent, fontsize, switch_fn, section_col, label_col, label_text_col, switch_col, section_pad, label_pad, switch_pad, label_style, zindex){

   const section = Create_widget_section(_, SECTION.HORIZONTAL, section_pad, [0, 0, zindex + 1], [0, 0], section_col, `DBG_UI ${name}`);
   section.SetName(`DBG_UI ${name}`);
   // parent.AddToMenu(section);

   const label = Create_widget_label(_, `DBG_UI ${name} label`, (ALIGN.BOTTOM | ALIGN.VERT_CENTER), [0, 0, zindex + 2], fontsize, label_col, label_text_col, label_pad, _, label_style);
   section.AddItem(label);

   const ui_switch = Create_widget_switch(_, 'on', 'off', [0, 0, zindex + 2], fontsize, switch_col, WHITE, switch_pad);
   ui_switch.SetName(`DBG_UI ${name} switch`);
   
   const callback_params = null; // Pass any params for the callback and get them at 'switch_fn' site
   ui_switch.Bind(switch_fn, null, callback_params);
   section.AddItem(ui_switch);

   return section;
}