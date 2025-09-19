"use strict";

import { Gl_set_vpos_y_top } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { Floor } from "../../Helpers/Math/MathOperations.js";
import { Color_hsv_to_rgb_calibrated } from "../Drawables/Material/Colors.js";
import { Mesh_set_wpos_y } from "../Drawables/Operations/MeshAttributesFunctions.js";
import { Create_rect_mesh, Create_widget_text } from "../Drawables/Widgets/Helpers/CreateWidgetInterface.js";
import { Style_rect_default_properties, Style_text_default_properties, Widget_gfx_ready_enable } from "../Drawables/Widgets/Helpers/WidgetEnableProperties.js";
import { Widget_render } from "../Drawables/Widgets/Helpers/WidgetRender.js";
import { Time_intervals_create } from "../Timers/TimeIntervals.js";


/** */
export function Visual_debug_create_properties(properties_struct) {


   const properties = {
      is_root:0x0,
      pos:{x:0, y:0},
      dim:{x:0, y:0,},

      // Function Callbacks
      Target_get_cur_val:null,
      Target_get_max_val:null,
      target_get_cur_val_params:null,
      target_get_max_val_params:null,

      name:properties_struct.name,
   };

   if(properties_struct.is_root !== undefined) 
      properties.is_root = properties_struct.is_root;
   else 
      properties.is_root = ROOT_WIDGETS.CREATE_ROOT;

   if(properties_struct.pos !== undefined) {
      if(properties_struct.pos.x === undefined) properties.pos.x = 100;
      else properties.pos.x = properties_struct.pos.x;
      if(properties_struct.pos.y === undefined) properties.pos.y = 100;
      else properties.pos.y = properties_struct.pos.y;
   }
   if(properties_struct.dim !== undefined) {
      if(properties_struct.dim.x === undefined) properties.dim.x = 20;
      else properties.dim.x = properties_struct.dim.x;
      if(properties_struct.dim.y === undefined) properties.dim.y = 200;
      else properties.dim.y = properties_struct.dim.y;
   }
   
   if(properties_struct.Target_get_cur_val !== undefined && properties_struct.Target_get_cur_val !== null) 
      properties.Target_get_cur_val = properties_struct.Target_get_cur_val;
   else alert('888877716665432. Callback function must be passed');

   if(properties_struct.Target_get_max_val !== undefined && properties_struct.Target_get_max_val !== null) 
      properties.Target_get_max_val = properties_struct.Target_get_max_val;
   else alert('888877716665433. Callback function must be passed');
   
   if(properties_struct.target_get_cur_val_params !== undefined) 
      properties.target_get_cur_val_params = properties_struct.target_get_cur_val_params;
   else properties.target_get_cur_val_params = null;

   if(properties_struct.target_get_max_val_params !== undefined) 
      properties.target_get_max_val_params = properties_struct.target_get_max_val_params;
   else properties.target_get_max_val_params = null;

  return properties;
}
/**
 * 
 * @param {*} properties_struct : Pass Visual_debug_create_properties() function. See the properties structure in Visual_debug_create_properties
 */
export function Visual_debug_create(properties_struct) {

   const dbg_surface = Vd_create_ratio_visualizer(properties_struct.is_root, properties_struct.pos.x, properties_struct.pos.y, properties_struct.dim.x, properties_struct.dim.y)


   const debug_info_text = {
      max_value: null,
      cur_value: null,
   };

   { // Text Info Display
      const w = dbg_surface.geom.dim[0] * 2 + 6, h = dbg_surface.geom.pos[1];
      const x = dbg_surface.geom.pos[0], y = dbg_surface.geom.pos[1];
      const tex_id = TEXTURES.MTSDF_CONSOLAS_1024;
      {
         const text_info = Create_widget_text(Style_text_default_properties({
            pos: [w, 0, 0], col: Color_hsv_to_rgb_calibrated(.14, 1, 1, 1, .8, .8),
            texture_id: tex_id, font_size: 8,
            text: 'value: 0.000',
         }));
         Widget_gfx_ready_enable({ mesh: text_info, });
         dbg_surface.AddItem(text_info);
         debug_info_text.cur_value = text_info;
      }
      {
         const text_info = Create_widget_text(Style_text_default_properties({
            pos: [w, 0, 0], col: Color_hsv_to_rgb_calibrated(.14, 1, 1, 1, .8, .8),
            texture_id: tex_id, font_size: 8,
            text: 'value: 0.000',
         }));
         Widget_gfx_ready_enable({ mesh: text_info, });
         dbg_surface.AddItem(text_info);
         debug_info_text.max_value = text_info;
      }
   }

   dbg_surface.GenGfxCtx();
   Widget_render(dbg_surface);



   const dbg_rect = dbg_surface.children.buffer[0];
   const params = {
      dbg_rect: dbg_rect, // The mesh to visualize the ratio
      initial_height: (dbg_rect.geom.dim[1]),

      debug_info_text: debug_info_text, // A text mesh to draw information on the screen
      info_text_pos_y_offset: properties_struct.pos.y,

      // Callbacks to get the cur and max values for clculating the ratio
      Target_get_cur_val:properties_struct.Target_get_cur_val,
      Target_get_max_val:properties_struct.Target_get_max_val,
      // Parameters for the 2 previus functions
      target_get_cur_val_params:properties_struct.target_get_cur_val_params,
      target_get_max_val_params:properties_struct.target_get_max_val_params,


   };

   Time_intervals_create(1, 'Visual Debug', TIME_INTERVAL_REPEAT_ALWAYS, (params) => {

      const dbg_rect = params.params.dbg_rect;

      const target_get_cur_val_params = params.params.target_get_cur_val_params;
      const target_get_max_val_params = params.params.target_get_max_val_params;
      const target_curr_val = params.params.Target_get_cur_val(target_get_cur_val_params);
      const target_max_val = params.params.Target_get_max_val(target_get_max_val_params);
      const ratio = target_curr_val / target_max_val;

      // console.log(target_curr_val, target_max_val, ratio)



      const initial_height = params.params.initial_height;
      const h = (ratio * initial_height * 2) - initial_height;

      Gl_set_vpos_y_top(dbg_rect.gfx, h);
      // Gl_set_dim_y(dbg_rect.gfx, initial_height+ratio-20);


      const info_text_max_val = params.params.debug_info_text.max_value;
      const info_text_cur_val = params.params.debug_info_text.cur_value;


      {
         const text = Floor(target_max_val);
         info_text_max_val.RenderTextFromString(`${text}`, true); // Change the text to the new info
         // Mesh_set_wpos_y(params.params.info_text_pos_y_offset);
      }
      {
         // const text = Floor(initial_height - (ratio * initial_height));
         const text = Floor(target_max_val-target_curr_val);
         info_text_cur_val.RenderTextFromString(`${text}`, true); // Change the text to the new info
         Mesh_set_wpos_y(info_text_cur_val, (ratio * initial_height * 2) + info_text_max_val.geom.dim[1]*2 );
      }



   }, params);
}

/** */
function Vd_create_ratio_visualizer(IS_WIDGET_ROOT, x, y, w, h) {

   const dbg_surface = Create_rect_mesh(Style_rect_default_properties({
      is_root: IS_WIDGET_ROOT,
      pos: [x, y, 0], dim: [w, h],
      col: Color_hsv_to_rgb_calibrated(0, 0, 1, 1, .4, 0),
      name:'VD-surface mesh',
   }));
   Widget_gfx_ready_enable({ mesh: dbg_surface, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.MOVE } });
   
   const pad = 4;
   const dbg_rect = Create_rect_mesh(Style_rect_default_properties({
      pos: [pad, pad, 0], dim: [w - pad, h - pad],
      col: Color_hsv_to_rgb_calibrated(.12, 1, 1, 1, .7, .7),
      name:'VD-dbg mesh',
   }));
   Widget_gfx_ready_enable({ mesh: dbg_rect, enable_sdf_rect: 10, });
   dbg_surface.AddItem(dbg_rect);

   return dbg_surface;
}