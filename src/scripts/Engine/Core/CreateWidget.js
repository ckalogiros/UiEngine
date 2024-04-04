import { Mesh_buffer_get } from "./MeshBuffer";
import { Section } from "../Drawables/Meshes/Section.js";
import { Widget_Label } from "../Drawables/Widgets/WidgetLabel.js";
import { Widget_Button, Widget_Switch } from "../Drawables/Widgets/WidgetButton.js";
import { Widget_Multi_Text, Widget_Text } from "../Drawables/Widgets/WidgetText.js";
import { Widget_Scroller } from "../Drawables/Widgets/WidgetScroller.js";
import { Widget_Slider } from "../Drawables/Widgets/WidgetSlider.js";
import { Widget_Dropdown } from "../Drawables/Widgets/Widget_Dropdown";
import { Rect } from "../Drawables/Meshes/Rect_Mesh";
import { Text_Mesh } from "../Drawables/Meshes/Text_Mesh";
import { Close_Button, Widget_Menu_Bar, Widget_Minimize } from "../Drawables/Widgets/WidgetMenu";
import { Widget_Switch_Simple } from "../Drawables/Widgets/WidgetSwitch";

/**
 * All Functions to create widgets.
 * Widgets created through this file 
 * are responsible for storing each mesh
 * in the generic buffer where all meshes
 * are stored. 
 * Also an index is stored to each widget,
 * so that the widget has a refference to its 
 * position in the Meshbuffer.
 */

const _mesh_buffer = Mesh_buffer_get();

/**********************************************************************************************************************/
// Widget Creation Functions
/**********************************************************************************************************************/

/**
 * Reserve the index for the widget to be created (the mesh buffer index),
 * so that we can pass it to the widget constructor for reference to any widget/meshes it may create.
 * The reason being, in case a widget should be a ROOT widget, its children should be stored at
 * the widget_root_buffer, that needs the ROOTs mesh_bufferidx index.
 */




export function Create_rect_mesh(pos, dim, col) {

   // Create a new mesh_buffer element and add a new section mesh
   const freeidx = _mesh_buffer.Add(new Rect(pos, dim, col));

   // Store the meshbuffer's index to the newly created mesh.
   _mesh_buffer.buffer[freeidx].mesh_bufferidx = freeidx;

   return _mesh_buffer.buffer[freeidx];
}



export function Create_text_mesh(text, pos, fontsize, col, bold, font) {

   // Create a new mesh_buffer element and add a new section mesh
   const freeidx = _mesh_buffer.Add(new Text_Mesh(text, pos, fontsize, col, bold, font));

   // Store the meshbuffer's index to the newly created mesh.
   _mesh_buffer.buffer[freeidx].mesh_bufferidx = freeidx;
   _mesh_buffer.buffer[freeidx].SetName(`[${freeidx}]{${text}}-TEXT_MESH`);

   return _mesh_buffer.buffer[freeidx];
}



export function Create_widget_section(ROOT_WIDGET_FLAGS=0x0, options, margin, pos, dim, col, name, style) {

   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Section(mesh_bufferidx, ROOT_WIDGET_FLAGS, options, margin, pos, dim, col, name, style));

   return _mesh_buffer.buffer[mesh_bufferidx];
}



export function Create_widget_text(ROOT_WIDGET_FLAGS=0x0, text, pos, fontSize, col, bold, pad) {

   // Create a new mesh_buffer element and add a new section mesh
   const freeidx = _mesh_buffer.Add(new Widget_Text(text, pos, fontSize, col, bold, pad));

   
   // Store the meshbuffer's index to the newly created mesh.
   _mesh_buffer.buffer[freeidx].mesh_bufferidx = freeidx;
   _mesh_buffer.buffer[freeidx].SetName(`[${freeidx}]{${text}}-WIDGET_TEXT`);

   return _mesh_buffer.buffer[freeidx];
}



export function Create_widget_multi_text(ROOT_WIDGET_FLAGS=0x0, text, ALIGNMENT, pos, fontSize, text_col, bold, pad) {

   // Create a new mesh_buffer element and add a new section mesh
   const freeidx = _mesh_buffer.Add(new Widget_Multi_Text(text, ALIGNMENT, pos, fontSize, text_col, bold, pad));
   
   // Store the meshbuffer's index to the newly created mesh.
   _mesh_buffer.buffer[freeidx].mesh_bufferidx = freeidx;
   _mesh_buffer.buffer[freeidx].SetName(`[${freeidx}]{${text}}-MULTI_TEXT`);
   
   return _mesh_buffer.buffer[freeidx];
}



export function Create_widget_label(ROOT_WIDGET_FLAGS=0x0, text, Align, pos, fontSize, col, text_col, pad, bold, style, font) {

   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Label(mesh_bufferidx, ROOT_WIDGET_FLAGS, text, Align, pos, fontSize, col, text_col, pad, bold, style, font));

   return _mesh_buffer.buffer[mesh_bufferidx];
}



export function Create_widget_button(ROOT_WIDGET_FLAGS=0x0, text, Align, pos, fontSize, col, text_col, pad, bold, style, font) {

   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Button(mesh_bufferidx, ROOT_WIDGET_FLAGS, text, Align, pos, fontSize, col, text_col, pad, bold, style, font));
   
   return _mesh_buffer.buffer[mesh_bufferidx];
}



export function Create_widget_switch(ROOT_WIDGET_FLAGS=0x0, text_on, text_off, pos, fontsize, col, text_col, pad, bold, style, font) {

   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Switch(mesh_bufferidx, ROOT_WIDGET_FLAGS, text_on, text_off, pos, fontsize, col, text_col, pad, bold, style, font));
   
   return _mesh_buffer.buffer[mesh_bufferidx];
}



export function Create_widget_switch_simple(ROOT_WIDGET_FLAGS=0x0, pos, size, col, pad, bold, style) {

   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Switch_Simple(mesh_bufferidx, ROOT_WIDGET_FLAGS, pos, size, col, pad, bold, style));
   
   return _mesh_buffer.buffer[mesh_bufferidx];
}



export function Create_widget_slider(ROOT_WIDGET_FLAGS=0x0, pos, dim, col, hover_margin) {

   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Slider(mesh_bufferidx, ROOT_WIDGET_FLAGS, pos, dim, col, hover_margin));
   
   return _mesh_buffer.buffer[mesh_bufferidx];
}



export function Create_widget_scroller(ROOT_WIDGET_FLAGS=0x0, scrolled_mesh, dim, col) {

   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Scroller(mesh_bufferidx, ROOT_WIDGET_FLAGS, scrolled_mesh, dim, col));
   
   return _mesh_buffer.buffer[mesh_bufferidx];
}



export function Create_widget_dropdown(ROOT_WIDGET_FLAGS=0x0, text, pos, col1, col_menu, text_col, btn_pad, bold, font, style, margin) {

   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Dropdown(mesh_bufferidx, ROOT_WIDGET_FLAGS, text, pos, col1, col_menu, text_col, btn_pad, bold, font, style, margin));

   return _mesh_buffer.buffer[mesh_bufferidx];
}



export function Create_widget_menubar(ROOT_WIDGET_FLAGS=0x0, pos, col, text_col, text, btn_pad, bold, style) {

   const mesh_bufferidx = _mesh_buffer.Reserve(); //                                                     pos, col = GREY[3], text_col = WHITE, name, pad = [14, 6], bold = .4, style = [2, 5, 2]
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Menu_Bar(mesh_bufferidx, ROOT_WIDGET_FLAGS, pos, col, text_col, text, btn_pad, bold, style));
   
   return _mesh_buffer.buffer[mesh_bufferidx];
}



export function Create_widget_close_btn(ROOT_WIDGET_FLAGS=0x0, root, text, pos, fontsize, col, text_col, pad, bold, style, font) {

         
   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Close_Button(mesh_bufferidx, ROOT_WIDGET_FLAGS, root, text, pos, fontsize, col, text_col, pad, bold, style, font));

   return _mesh_buffer.buffer[mesh_bufferidx];
}



export function Create_widget_minimize_btn(ROOT_WIDGET_FLAGS=0x0, root, pos, fontsize, col, text_col, pad, bold, style, font) {

   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Minimize(mesh_bufferidx, ROOT_WIDGET_FLAGS, root, pos, fontsize, col, text_col, pad, bold, style, font));
   
   return _mesh_buffer.buffer[mesh_bufferidx];
}

