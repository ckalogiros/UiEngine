import { Mesh_buffer_get } from "../../../Core/MeshBuffer.js";
import { Widget_Label } from "../WidgetLabel.js";
import { Widget_Button, Widget_Switch } from "../WidgetButton.js";
import { Widget_Multi_Text, Widget_Text } from "../WidgetText.js";
import { Widget_Slider_XX1, Widget_Slider_Simple } from "../WidgetSlider.js";
import { Widget_Dropdown } from "../Widget_Dropdown.js";
import { Rect_Mesh } from "../../Meshes/Rect_Mesh.js";
import { Text_Mesh } from "../../Meshes/Text_Mesh.js";
import { Close_Button, Widget_Menu_Bar, Widget_Minimize } from "../WidgetMenu.js";
import { Widget_Switch_Simple } from "../WidgetSwitch.js";
import { NOTIFICATION_TYPE, Notifications_send } from "../../DebugInfo/DebugInfoUiNotifications.js";
import { Widget_Color_Picker } from "../WidgetColorPicker.js";
import { Mesh_set_name } from "../../Operations/MeshPropertiesFunctions.js";
import { Particle_system_create_emitter } from "../../../ParticlesSystem/ParticlesSystem.js";

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
 * "#1"Reserve the index for the widget to be created (the mesh buffer index),
 * so that we can pass it to the widget constructor for reference to any widget/meshes it may create.
 * The reason being, in case a widget should be a ROOT widget, its children should be stored at
 * the widget_root_buffer, that needs to be constructed with the "mesh_bufferidx" index.
 */



const NOTIFICATIONS_ON = true;


/**
 * @param {*} properties // TODO: 
 * @returns 
 */
export function Create_rect_mesh(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve(); // "#1" Reserve the mesh's index before mesh creation
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, (new Rect_Mesh(mesh_bufferidx, properties)));

   if (NOTIFICATIONS_ON && !properties.is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}
/**
 * @param {*} properties // TODO: 
 * @see {@link Text_Mesh}
 */
export function Create_text_mesh(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Text_Mesh(mesh_bufferidx, properties));

   Mesh_set_name(_mesh_buffer.buffer[mesh_bufferidx], `T[${mesh_bufferidx}]:{${properties.text}}`);

   if (NOTIFICATIONS_ON && !properties.is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}
/** */
export function Create_widget_text(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Text(mesh_bufferidx, properties));

   Mesh_set_name(_mesh_buffer.buffer[mesh_bufferidx], `WT[${mesh_bufferidx}]{${properties.text}}`);

   if (NOTIFICATIONS_ON && !properties.is_debug_mesh);
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}
/** */
export function Create_widget_multi_text(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Multi_Text(mesh_bufferidx, properties));

   Mesh_set_name(_mesh_buffer.buffer[mesh_bufferidx], `MT[${mesh_bufferidx}]{${properties.text}}`); // Set name after mesh_bufferidx is created

   if (NOTIFICATIONS_ON && !properties.is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}
/** */
export function Create_widget_label(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Label(mesh_bufferidx, properties));
   Mesh_set_name(_mesh_buffer.buffer[mesh_bufferidx], `L[${mesh_bufferidx}]{${properties.text}}`); // Set name after mesh_bufferidx is created

   if (NOTIFICATIONS_ON && properties.is_debug_mesh === 0x0)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}
/** */
export function Create_widget_button(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Button(mesh_bufferidx, properties));

   if (NOTIFICATIONS_ON && !properties.is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}
/** */
export function Create_widget_switch_button(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Switch(mesh_bufferidx, properties));

   if (NOTIFICATIONS_ON && !properties.is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}
/** */
export function Create_widget_switch_simple(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Switch_Simple(mesh_bufferidx, properties));

   if (NOTIFICATIONS_ON && !properties.is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}
/**
 * @param {*} properties { is_root, pos, dim, col, hover_margin, handle_pos, handle_dim, handle_col, is_debug_mesh, } 
 * @see {@link Widget_Slider_Simple}
 */
export function Create_widget_slider_simple(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Slider_Simple(mesh_bufferidx, properties));

   if (NOTIFICATIONS_ON && !properties.is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}
/** */
export function Create_widget_slider(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Slider_XX1(mesh_bufferidx, properties));

   if (NOTIFICATIONS_ON && !properties.is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}
/** */
export function Create_widget_scroller(is_root = 0x0, scrolled_section, dim, col, scroller_margin, is_debug_mesh = 0x0) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Scroller(mesh_bufferidx, is_root, scrolled_section, dim, col, scroller_margin, is_debug_mesh));

   if (NOTIFICATIONS_ON && !is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}
/** */
export function Create_widget_dropdown(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Dropdown(mesh_bufferidx, properties));

   if (NOTIFICATIONS_ON && !properties.is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}
/** */
export function Create_widget_menubar(is_root = 0x0, pos, dim, col, text_col, text, pad, bold, style, is_debug_mesh = 0x0) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Menu_Bar(mesh_bufferidx, is_root, pos, dim, col, text_col, text, pad, bold, style, 1, is_debug_mesh));

   if (NOTIFICATIONS_ON && !is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}
/** */
export function Create_widget_close_btn(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Close_Button(mesh_bufferidx, properties));

   if (NOTIFICATIONS_ON && !properties.is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}
/** */
export function Create_widget_minimize_btn(is_root = 0x0, root, pos, font_size, col, text_col, pad, bold, style, font, is_debug_mesh = 0x0) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Minimize(mesh_bufferidx, is_root, root, pos, font_size, col, text_col, pad, bold, style, font, is_debug_mesh));

   if (NOTIFICATIONS_ON && !is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}
/** */
export function Create_widget_color_picker(is_root = 0x0, margin, pos, dim, col, name, style, is_debug_mesh = 0x0) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, new Widget_Color_Picker(mesh_bufferidx, is_root, margin, pos, dim, col, name, style, _, is_debug_mesh));

   if (NOTIFICATIONS_ON && !is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}
/**
 * @param {*} properties name, col, pos, dim, t_step, life_time, accel, deccel, gravity, max_speed, texture_id, num_particles_per_frame, scale_down
 * @returns 
 */
export function Create_particle_emitter(properties) {

   const _mesh_buffer = Mesh_buffer_get();
   const mesh_bufferidx = _mesh_buffer.Reserve();
   // _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, Particle_system_create_emitter(mesh_bufferidx, name, col, pos, dim, t_step, life_time, accel, deccel, gravity, max_speed, texture_id, num_particles_per_frame, scale_down));
   _mesh_buffer.AddAtReservedIndex(mesh_bufferidx, Particle_system_create_emitter(mesh_bufferidx, properties));

   if (NOTIFICATIONS_ON && !properties.is_debug_mesh)
      Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

   return _mesh_buffer.buffer[mesh_bufferidx];
}
