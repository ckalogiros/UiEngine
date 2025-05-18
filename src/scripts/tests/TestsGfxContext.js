"use strict";

import { Mesh_unif_get_vb_root_wpos } from "../Engine/Core/MeshUniformsBuffer.js";
import { View_build_group_from_root_mesh } from "../Engine/Core/Views/MeshBufferViews.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../Engine/Core/Views/RootView.js";
import { Color_hsv_to_rgb_calibrated } from "../Engine/Drawables/Material/Colors.js";
import { Align_nested_sections_pre } from "../Engine/Drawables/Operations/AlignNestedSections.js";
import { Create_rect_mesh, Create_widget_label } from "../Engine/Drawables/Widgets/Helpers/CreateWidgetInterface.js";
import { Style_label_default_properties, Style_rect_default_properties, Widget_gfx_ready_enable } from "../Engine/Drawables/Widgets/Helpers/WidgetEnableProperties.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../Engine/Events/EventFunctions.js";





function TEST_SUCCESS(test_name) {
   console.log(`* ${test_name}:\n*   PASSED`)
}
function TEST_FAILED(test_name) {
   console.log(`* ${test_name}\n* TEST_FAILED`)
}









export function Test_find_match_from_parent_descending() {


   const test_name = 'find_match_from_parent_descending';
   const font_size = 18;

   const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [100, 200, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.6, .5, 1, 1, .1, 0), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF, name: 'ROOT' }));
   Widget_gfx_ready_enable({
      mesh: section, enable_sdf_rect: 15,
      listener: { type: LISTEN_EVENT_TYPES.MOVE },
   });

   section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);



   const count = 5;
   let brightness_increments = 1 / count;


   // First panel
   const s1 = Create_rect_mesh(Style_rect_default_properties({ 
      pad: [10, 10], pos: [100, 200, 0], dim: [20, 20], 
      col: Color_hsv_to_rgb_calibrated(.6, .5, 1, 1, .2, 0), 
      layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF, name: 'S1' 
   }));
   Widget_gfx_ready_enable({
      mesh: s1, enable_sdf_rect: 15,
      listener: { type: LISTEN_EVENT_TYPES.MOVE },
   });
   section.AddItem(s1);
   s1.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.NEW);


   let brightness = 0;
   for (let i = 0; i < count; i++) {

      const l1 = Create_widget_label(Style_label_default_properties({ 
         text: `${i}`, pos: [0, 0, 1], font_size: font_size, 
         col: Color_hsv_to_rgb_calibrated(0.7, 1., .8, 1, brightness, .0), 
         text_pad: [6, 4], layout: LAYOUT.VERTICAL 
      }));
      Widget_gfx_ready_enable({ mesh: l1, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
      s1.AddItem(l1);
      l1.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

      brightness += brightness_increments;
   }

   brightness = 0;

   // Secon panel
   const s2 = Create_rect_mesh(Style_rect_default_properties({ 
      pad: [10, 10], pos: [100, 200, 0], dim: [20, 20], 
      col: Color_hsv_to_rgb_calibrated(.6, .5, 1, 1, .2, 0), 
      layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF, name: 'S2' 
   }));
   Widget_gfx_ready_enable({
      mesh: s2, enable_sdf_rect: 15,
      listener: { type: LISTEN_EVENT_TYPES.MOVE },
   });
   section.AddItem(s2);
   s2.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


   for (let i = 0; i < count; i++) {

      const l2 = Create_widget_label(Style_label_default_properties({ 
         text: `${i}`, pos: [0, 0, 1], font_size: font_size, 
         col: Color_hsv_to_rgb_calibrated(0.7, 1., .8, 1, brightness, .0), 
         text_pad: [6, 4], layout: LAYOUT.VERTICAL 
      }))
      Widget_gfx_ready_enable({ mesh: l2, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
      s2.AddItem(l2);
      l2.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC);
      brightness += brightness_increments;
   }



   section.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
   Align_nested_sections_pre(section)
   section.Render();
   View_build_group_from_root_mesh(section);
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);



   /** */
   let root_vbidx = section.gfx.vb.idxs.buffer[0];
   let s1_vb_idx = s1.gfx.vb.idxs.buffer[0];
   let s1_labels_vb_idx = s1.children.buffer[0].gfx.vb.idxs.buffer[0];
   let s1_labels_text_vb_idx = s1.children.buffer[0].text_mesh.gfx.vb.idxs.buffer[0];
   let s2_vb_idx = s2.gfx.vb.idxs.buffer[0];
   let s2_labels_vb_idx = s2.children.buffer[0].gfx.vb.idxs.buffer[0];
   let s2_labels_text_vb_idx = s2.children.buffer[0].text_mesh.gfx.vb.idxs.buffer[0];

   console.log(
      '\nroot_vbidx', root_vbidx,
      '\ns1_vb_idx', s1_vb_idx,
      '\ns1_labels_vb_idx', s1_labels_vb_idx,
      '\ns1_labels_text_vb_idx', s1_labels_text_vb_idx,
      '\ns2_vb_idx', s2_vb_idx,
      '\ns2_labels_vb_idx', s2_labels_vb_idx,
      '\ns2_labels_text_vb_idx', s2_labels_text_vb_idx,
   );
   

   console.log('Test:', test_name);
   if(root_vbidx !== s1_vb_idx) TEST_SUCCESS('is section 1 on new vertex buffer');
   else  TEST_FAILED('is section 1 on new vertex buffer');
   if(s1_labels_vb_idx !== s2_labels_vb_idx) TEST_SUCCESS('is section 1 labels on different vertex buffer from section 2 labels');
   else  TEST_FAILED('is section 1 labels on different vertex buffer from section 2 labels');
   if(s1_labels_text_vb_idx !== s2_labels_text_vb_idx) TEST_SUCCESS('is section 1 labels text meshes on different vertex buffer from section 2 labels text meshes');
   else  TEST_FAILED('is section 1 labels text meshes on different vertex buffer from section 2 labels text meshes');

   // expect(root_vbidx).toBe(0);
   // test("TTTEST", (root_vbidx) => {
   // });


}