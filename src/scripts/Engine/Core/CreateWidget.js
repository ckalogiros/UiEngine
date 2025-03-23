import { Mesh_buffer_get } from "./MeshBuffer.js";
import { Section } from "../Drawables/Meshes/Section.js";
import { Widget_Label } from "../Drawables/Widgets/WidgetLabel.js";
import { Widget_Button, Widget_Switch } from "../Drawables/Widgets/WidgetButton.js";
import { Widget_Multi_Text, Widget_Text } from "../Drawables/Widgets/WidgetText.js";
import { Widget_Slider_XX1, Widget_Slider_Simple } from "../Drawables/Widgets/WidgetSlider.js";
import { Widget_Dropdown } from "../Drawables/Widgets/Widget_Dropdown.js";
import { Rect_Mesh } from "../Drawables/Meshes/Rect_Mesh.js";
import { Text_Mesh } from "../Drawables/Meshes/Text_Mesh.js";
import { Close_Button, Widget_Menu_Bar, Widget_Minimize } from "../Drawables/Widgets/WidgetMenu.js";
import { Widget_Switch_Simple } from "../Drawables/Widgets/WidgetSwitch.js";
import { NOTIFICATION_TYPE, Notifications_send } from "../Drawables/DebugInfo/DebugInfoUiNotifications.js";
import { Widget_Color_Picker } from "../Drawables/Widgets/WidgetColorPicker.js";

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



/**********************************************************************************************************************/
// Widget Creation Functions
/**********************************************************************************************************************/

/**
 * Reserve the index for the widget to be created (the mesh buffer index),
 * so that we can pass it to the widget constructor for reference to any widget/meshes it may create.
 * The reason being, in case a widget should be a ROOT widget, its children should be stored at
 * the widget_root_buffer, that needs the ROOTs mesh_bufferidx index.
 */



const NOTIFICATIONS_ON = true;


/**
 * 
 * @param {*} properties {is_root, pos, dim, col, name, style, margin, num_faces, is_debug_mesh}
 * @returns 
 */
export function Create_rect_mesh(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   // Create a new mesh_buffer element and add a new section mesh
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, (new Rect_Mesh(mesh_bufferidx, properties)));

   if (NOTIFICATIONS_ON && !properties.is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);


   return _mesh_buffer.buffer[mesh_bufferidx];
}


/**
 * This function calculates the area of a rectangle.
 * @param {*} properties { pos, dim, col, pad, text, font_size, texture_id, sub_texture_id, variant_idx, is_debug_mesh, }
 * @see {@link Text_Mesh}
 */
export function Create_text_mesh(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   // Create a new mesh_buffer element and add a new section mesh
   const mesh_bufferidx = _mesh_buffer.Add(new Text_Mesh(properties));

   // Store the meshbuffer's index to the newly created mesh.
   _mesh_buffer.buffer[mesh_bufferidx].mesh_bufferidx = mesh_bufferidx;
   _mesh_buffer.buffer[mesh_bufferidx].SetName(`TEXT_MESH[${mesh_bufferidx}]:{${text}}`);

   if (NOTIFICATIONS_ON && !is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}


/** (is_root, options, pad, pos, dim, col, name, style, num_faces, texture_id, sub_texture_id, is_debug_mesh) { */
export function Create_widget_section(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx,
      new Section(mesh_bufferidx, properties)
   );

   if (NOTIFICATIONS_ON && !properties.is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}



export function Create_widget_text(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   // Create a new mesh_buffer element and add a new section mesh
   const mesh_bufferidx = _mesh_buffer.Add(new Widget_Text(properties));


   // Store the meshbuffer's index to the newly created mesh.
   _mesh_buffer.buffer[mesh_bufferidx].mesh_bufferidx = mesh_bufferidx;
   _mesh_buffer.buffer[mesh_bufferidx].SetName(`WidgetText[${mesh_bufferidx}]{${properties.text}}`);

   if (NOTIFICATIONS_ON && !properties.is_debug_mesh);
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}


export function Create_widget_multi_text(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   // Create a new mesh_buffer element and add a new section mesh
   const mesh_bufferidx = _mesh_buffer.Add(new Widget_Multi_Text(properties));

   // Store the meshbuffer's index to the newly created mesh.
   _mesh_buffer.buffer[mesh_bufferidx].mesh_bufferidx = mesh_bufferidx;
   _mesh_buffer.buffer[mesh_bufferidx].SetName(`[${mesh_bufferidx}]{${properties.text}}-MULTI_TEXT`); // Set name after mesh_bufferidx is created

   if (NOTIFICATIONS_ON && !properties.is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}


export function Create_widget_label(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Label(mesh_bufferidx, properties));
   _mesh_buffer.buffer[mesh_bufferidx].SetName(`LABEL[${mesh_bufferidx}]{${properties.text}}`); // Set name after mesh_bufferidx is created

   if (NOTIFICATIONS_ON && properties.is_debug_mesh === 0x0)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}



export function Create_widget_button(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Button(mesh_bufferidx, properties));

   if (NOTIFICATIONS_ON && !properties.is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}



//  is_root = 0x0, text_on, text_off, pos, font_size, col, text_col, pad, bold, style, font, is_debug_mesh = 0x0) {
export function Create_widget_switch(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Switch(mesh_bufferidx, properties));

   if (NOTIFICATIONS_ON && !properties.is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}



// properties: { is_root, pos, size, col, col2, pad, bold, style, is_debug_mesh }
export function Create_widget_switch_simple(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   // _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Switch_Simple(mesh_bufferidx, is_root, pos, size, col, col2, pad, bold, style, is_debug_mesh));
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Switch_Simple(mesh_bufferidx, properties));

   if (NOTIFICATIONS_ON && !properties.is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}



// properties: {is_root, pos, dim, col, hover_margin, handle_dim, handle_col, faces, is_debug_mesh }
//{ is_root:is_root, pos: pos, dim: dim, col: col, name: name, style: style, num_faces: num_faces, texture_id: INT_NULL, sub_texture_id: INT_NULL, is_debug_mesh: is_debug_mesh 
export function Create_widget_slider_simple(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   // _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Slider_Simple(mesh_bufferidx, is_root, pos, dim, col, hover_margin, handle_dim, handle_col, faces, is_debug_mesh));
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Slider_Simple(mesh_bufferidx, properties));

   if (NOTIFICATIONS_ON && !properties.is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}



export function Create_widget_slider(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   // _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Slider_XX1(mesh_bufferidx, is_root, pos, dim, col, hover_margin, name, is_debug_mesh));
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Slider_XX1(mesh_bufferidx, properties));

   if (NOTIFICATIONS_ON && !properties.is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}



export function Create_widget_scroller(is_root = 0x0, scrolled_section, dim, col, scroller_margin, is_debug_mesh = 0x0) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Scroller(mesh_bufferidx, is_root, scrolled_section, dim, col, scroller_margin, is_debug_mesh));

   if (NOTIFICATIONS_ON && !is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}



// export function Create_widget_dropdown(is_root = 0x0, text, pos, col1, col_menu, text_col, btn_pad, bold, font, font_size=10, style, margin, is_debug_mesh = 0x0) {
export function Create_widget_dropdown(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   // _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Dropdown(mesh_bufferidx, is_root, text, pos, col1, col_menu, text_col, btn_pad, bold, font, font_size, style, margin, is_debug_mesh));
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Dropdown(mesh_bufferidx, properties));

   if (NOTIFICATIONS_ON && !properties.is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}



export function Create_widget_menubar(is_root = 0x0, pos, dim, col, text_col, text, pad, bold, style, is_debug_mesh = 0x0) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   // TODO: num_faces should pass as parameter
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Menu_Bar(mesh_bufferidx, is_root, pos, dim, col, text_col, text, pad, bold, style, 1, is_debug_mesh));

   if (NOTIFICATIONS_ON && !is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}



export function Create_widget_close_btn(is_root = 0x0, root, text, pos, font_size, col, text_col, pad, bold, style, font, is_debug_mesh = 0x0) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Close_Button(mesh_bufferidx, is_root, root, text, pos, font_size, col, text_col, pad, bold, style, font, is_debug_mesh));

   if (NOTIFICATIONS_ON && !is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}



export function Create_widget_minimize_btn(is_root = 0x0, root, pos, font_size, col, text_col, pad, bold, style, font, is_debug_mesh = 0x0) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Minimize(mesh_bufferidx, is_root, root, pos, font_size, col, text_col, pad, bold, style, font, is_debug_mesh));

   if (NOTIFICATIONS_ON && !is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}




// It does not store mesh's name to str_buffer
export function Create_widget_text_for_debug_ui_only(is_root = 0x0, text, pos, font_size, col, bold, pad, is_debug_mesh = 0x0) {

   const _mesh_buffer = Mesh_buffer_get();
   // Create a new mesh_buffer element and add a new section mesh
   const mesh_bufferidx = _mesh_buffer.Add(new Widget_Text(is_root, text, pos, font_size, col, bold, pad));


   // Store the meshbuffer's index to the newly created mesh.
   _mesh_buffer.buffer[mesh_bufferidx].mesh_bufferidx = mesh_bufferidx;
   _mesh_buffer.buffer[mesh_bufferidx].name = `[${mesh_bufferidx}]{${text}}-WIDGET_TEXT`;


   if (NOTIFICATIONS_ON && !is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}



export function Create_widget_color_picker(is_root = 0x0, options, margin, pos, dim, col, name, style, is_debug_mesh = 0x0) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Color_Picker(mesh_bufferidx, is_root, options, margin, pos, dim, col, name, style, _, is_debug_mesh));

   if (NOTIFICATIONS_ON && !is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}
