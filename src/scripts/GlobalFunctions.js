"use strict";

export function State_mesh_set_hovered(mesh) {
   STATE.mesh.hovered = mesh;
   if (!mesh) {
      STATE.mesh.hoveredIdx = INT_NULL;
   }
   else {
      STATE.mesh.hoveredIdx = mesh.mesh_bufferidx;
   }
}
export function State_mesh_set_grabed(mesh) {
   STATE.mesh.grabed = mesh;
   if (!mesh) {
      STATE.mesh.grabedIdx = INT_NULL;
   }
   else {
      STATE.mesh.grabedIdx = mesh.mesh_bufferidx;
   }
}
export function State_mesh_set_clicked(mesh) {
   STATE.mesh.clicked = mesh;
   if (!mesh) {
      STATE.mesh.clickedIdx = INT_NULL;
   }
   else {
      STATE.mesh.clickedIdx = mesh.mesh_bufferidx;
   }
}
export function State_mesh_set_focused(mesh) {

   STATE.mesh.focused = mesh;
   if (!mesh) {
      STATE.mesh.focusedIdx = INT_NULL;
   }
   else {
      STATE.mesh.focusedIdx = mesh.mesh_bufferidx;
   }
}
export function State_mesh_set_clickhold(mesh) {

   STATE.mesh.click_hold = mesh;
   if (!mesh) {
      STATE.mesh.click_holdidx = INT_NULL;
   }
   else {
      STATE.mesh.click_holdidx = mesh.mesh_bufferidx;
   }
}
export function State_mesh_reset(mesh) {
   if (mesh === STATE.mesh.hovered) {
      STATE.mesh.hovered = null;
      STATE.mesh.hoveredIdx = INT_NULL;
   }
   if (mesh === STATE.mesh.clicked) {
      STATE.mesh.clicked = null;
      STATE.mesh.grabedIdx = INT_NULL;
   }
   if (mesh === STATE.mesh.grabed) {
      STATE.mesh.grabed = null;
      STATE.mesh.clickedIdx = INT_NULL;
   }
   if (mesh === STATE.mesh.focused) {
      STATE.mesh.focused = null;
      STATE.mesh.focusedIdx = INT_NULL;
   }
}

export function State_reset() {

   STATE.loop.paused = false;

   STATE.mesh.hovered = null;
   STATE.mesh.hoveredIdx = INT_NULL;
   
   STATE.mesh.clicked = null;
   STATE.mesh.clickedIdx = INT_NULL;
   
   STATE.mesh.grabed = null;
   STATE.mesh.grabedIdx = INT_NULL;
   
   STATE.mesh.focused = null;
   STATE.mesh.focusedIdx = INT_NULL;
   
   STATE.mesh.click_hold = null;
   STATE.mesh.click_holdidx = INT_NULL;

   STATE.mouse.activeClickedButtonId
}


export function Mesh_state_toString(flag) {

   let str = '';
   if (flag & MESH_STATE_FLAGS.IN_FOCUS) str += 'IN_FOCUS,'
   if (flag & MESH_STATE_FLAGS.IN_HOVER) str += 'IN_HOVER,'
   if (flag & MESH_STATE_FLAGS.IN_SCALE) str += 'IN_SCALE,'
   if (flag & MESH_STATE_FLAGS.IN_MOVE) str += 'IN_MOVE,'
   if (flag & MESH_STATE_FLAGS.IN_GRAB) str += 'IN_GRAB,'
   if (flag & MESH_STATE_FLAGS.IN_HOVER_COLOR) str += 'IN_HOVER_COLOR,'

   if (flag & MESH_STATE_FLAGS.IS_MOVABLE) str += 'IS_MOVABLE,'
   if (flag & MESH_STATE_FLAGS.IS_GRABABLE) str += 'IS_GRABABLE,'

   if (flag & MESH_STATE_FLAGS.IS_HOVERABLE) str += 'IS_HOVERABLE,'
   if (flag & MESH_STATE_FLAGS.HAS_POPUP) str += 'HAS_POPUP,'
   if (flag & MESH_STATE_FLAGS.IS_HOVER_COLORABLE) str += 'IS_HOVER_COLORABLE,'

   if (flag & MESH_STATE_FLAGS.ACTIVE) str += 'ACTIVE,'
   if (flag & MESH_STATE_FLAGS.CLIPED_Y) str += 'CLIPED_Y,'
   if (flag & MESH_STATE_FLAGS.CLIPED_X) str += 'CLIPED_X,'
   if (flag & MESH_STATE_FLAGS.IN_FOCUS) str += 'IN_FOCUS,'
   if (flag & MESH_STATE_FLAGS.IN_HOVER) str += 'IN_HOVER,'
   if (flag & MESH_STATE_FLAGS.IN_MOVE) str += 'IN_MOVE,'
   if (flag & MESH_STATE_FLAGS.IN_RESIZE) str += 'IN_RESIZE,'
   if (flag & MESH_STATE_FLAGS.IN_GRAB) str += 'IN_GRAB,'
   if (flag & MESH_STATE_FLAGS.IN_HOVER_COLOR) str += 'IN_HOVER_COLOR,'
   if (flag & MESH_STATE_FLAGS.IN_HOLD_CLICK) str += 'IN_HOLD_CLICK,'
   if (flag & MESH_STATE_FLAGS.IS_HOVERABLE) str += 'IS_HOVERABLE,'
   if (flag & MESH_STATE_FLAGS.IS_CLICKABLE) str += 'IS_CLICKABLE,'
   if (flag & MESH_STATE_FLAGS.IS_RESIZEABLE) str += 'IS_RESIZEABLE,'
   if (flag & MESH_STATE_FLAGS.IS_MOVABLE) str += 'IS_MOVABLE,'
   if (flag & MESH_STATE_FLAGS.IS_GRABABLE) str += 'IS_GRABABLE,'
   if (flag & MESH_STATE_FLAGS.IS_FAKE_EVENT) str += 'IS_FAKE_EVENT,'
   if (flag & MESH_STATE_FLAGS.IS_FAKE_HOVERABLE) str += 'IS_FAKE_HOVERABLE,'
   if (flag & MESH_STATE_FLAGS.IS_FAKE_CLICKABLE) str += 'IS_FAKE_CLICKABLE,'
   if (flag & MESH_STATE_FLAGS.IS_HOVER_COLORABLE) str += 'IS_HOVER_COLORABLE,'
   if (flag & MESH_STATE_FLAGS.IS_HOLD_CLICK) str += 'IS_HOLD_CLICK,'
   if (flag & MESH_STATE_FLAGS.IN_SCALE) str += 'IN_SCALE,'
   if (flag & MESH_STATE_FLAGS.HAS_POPUP) str += 'HAS_POPUP,'
   if (flag & MESH_STATE_FLAGS.HAS_CLIP) str += 'HAS_CLIP,'
   if (flag & MESH_STATE_FLAGS.STICKY_POSX) str += 'STICKY_POSX,'
   if (flag & MESH_STATE_FLAGS.STICKY_POSY) str += 'STICKY_POSY,'

   return str;
   // console.info(str)
}







export function Listen_event_types_get_type_from_index(idx) {

	if (idx === LISTEN_EVENT_TYPES_INDEX.HOVER) return LISTEN_EVENT_TYPES.HOVER;
	if (idx === LISTEN_EVENT_TYPES_INDEX.CLICK) return LISTEN_EVENT_TYPES.CLICK_UP;
}

export function Listen_event_get_idx_from_type(etype) {

	if (etype & LISTEN_EVENT_TYPES.HOVER) return LISTEN_EVENT_TYPES_INDEX.HOVER;
	if (etype & (LISTEN_EVENT_TYPES.CLICK_UP|LISTEN_EVENT_TYPES.MOVE)) return LISTEN_EVENT_TYPES_INDEX.CLICK;
}




   // Init() {
   
   //     // Set prerequisites for shader operations that need sdf_rect operation 
   //     SID.SHADER_OPERATIONS.GROUP_SDF_RECT = (
   //         SID.SHADER_OPERATIONS |
   //         SID.SHADER_OPERATIONS.OUTER_GLOW_RECT |
   //         SID.SHADER_OPERATIONS.INNER_SHADOW_RECT |
   //         SID.SHADER_OPERATIONS.OUTER_SHADOW_RECT |
   //         SID.SHADER_OPERATIONS.INNER_SHADOW_RECT2
   //     );
   // },

export function Sid_check_match(sid1, sid2) {

   // Remove all Block Uniforms flags. Better to reuse a program than to create a duplicate only because some meshes dont use Blocked Uniforms. 
   // For individual uniforms we must include for the match, since a Program's shaders may be compiled before the creation of other meshes with the same sid except an extra uniform
   const  unif1 = sid1.unif & ~(SID.UNIF.PROJECTION_MATRIX|SID.UNIF.SCREEN_RESOLUTION);
   const  unif2 = sid2.unif & ~(SID.UNIF.PROJECTION_MATRIX|SID.UNIF.SCREEN_RESOLUTION);
   
   // const  attr1 = sid1.attr & ~(SID.ATTR.TEST_MULTI_VERTEX|SID.ATTR.COL4_PER_VERTEX)
   // const  attr2 = sid2.attr & ~(SID.ATTR.TEST_MULTI_VERTEX|SID.ATTR.COL4_PER_VERTEX)
   const  attr1 = sid1.attr & ~(SID.ATTR.TEST_MULTI_VERTEX);
   const  attr2 = sid2.attr & ~(SID.ATTR.TEST_MULTI_VERTEX);

   const  shad1 = sid1.shad;
   const  shad2 = sid2.shad;
   const  shader_ops1 = sid1.shad_ops;
   const  shader_ops2 = sid2.shad_ops;
   // const  shad1 = sid1.shad & ~(SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X);
   // const  shad2 = sid2.shad & ~(SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X);
   if (
         shad1 === shad2 &&
         attr1 === attr2 &&
         unif1 === unif2 && 
         shader_ops1 === shader_ops2 && 
         sid1.pass === sid2.pass
         // sid1.fx === sid2.fx
   ) {
         return true;
   }

   return false;
}

export function Sid_make_copy(src){
   const sid =  {
         shad: src.shad,
         attr: src.attr,
         unif: src.unif,
         pass: src.pass,
         inst: src.inst,
         shad_ops: src.shad_ops,
         fx:   src.fx,
         blend_options:   src.blend_options,
   };
   return sid;
}


export function Sid_create_name_by_sid(sid){

   let str = ['','','',''];
   let k = 0;

   if (sid.shad) str[k] += 'ShaderProperties:'
   if (sid.shad & SID.SHAD.INDEXED) str[k] += 'IndexedGeometry, '
   if (sid.shad & SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X) str[k] += 'ConectedFaces, '
   if (sid.shad & SID.SHAD.INDEXED_PATT_DISCONTINUE_4) str[k] += 'VertexBreak-4, '
   if (sid.shad & SID.SHAD.INDEXED_PATT_DISCONTINUE_6) str[k] += 'VertexBreak-, '
   if (sid.shad & SID.SHAD.PRE_MULTIPLIED_ALPHA) str[k] += 'Premultiplied Alpha, '
   // if (sid.shad) str[k] += '\n'

   k++;
   if (sid.attr) str[k] += 'Attribs:'
   if (sid.attr & SID.ATTR.COL4) str[k] += 'col4, '
   if (sid.attr & SID.ATTR.COL4_PER_VERTEX) str[k] += 'col4_per_vertex, '
   if (sid.attr & SID.ATTR.VPOS2) str[k] += 'pos2, '
   if (sid.attr & SID.ATTR.DIM2) str[k] += 'dim2, '
   if (sid.attr & SID.ATTR.TIME) str[k] += 'time, '
   if (sid.attr & SID.ATTR.ANGLE) str[k] += 'angle, '
   if (sid.attr & SID.ATTR.U_SCALE_VEC2) str[k] += 'scale2, '
   if (sid.attr & SID.ATTR.TEX2) str[k] += 'tex2, '
   if (sid.attr & SID.ATTR.WPOS3) str[k] += 'wpos4, '
   if (sid.attr & SID.ATTR.TIME) str[k] += 'time, '
   if (sid.attr & SID.ATTR.SDF) str[k] += 'Sdf, '
   if (sid.attr & SID.ATTR.MSDF) str[k] += 'Msdf, '

   k++;
   if (sid.inst) str[k] += 'InstancedGeometry:'
   if (sid.inst & SID.INST.COL4) str[k] += 'cal4, '
   if (sid.inst & SID.INST.VPOS2) str[k] += 'pos2, '
   if (sid.inst & SID.INST.TEX2) str[k] += 'tex2, '
   if (sid.inst & SID.INST.WPOS3) str[k] += 'wpos4, '
   if (sid.inst & SID.INST.TIME) str[k] += 'time, '
   if (sid.inst & SID.INST.SDF) str[k] += 'sdf, '
   if (sid.inst & SID.INST.MSDF) str[k] += 'msdf, '
   if (sid.inst & SID.INST.POS3) str[k] += 'pos3, '
   if (sid.inst & SID.INST.COL4_PER_VERTEX) str[k] += 'col4_per_vertex, '
   if (sid.inst & SID.INST.EMPTY) str[k] += 'empty, '
   // if (sid.inst) str[k] += '\n'

   k++;
   if (sid.unif) str[k] += 'Uniforms:'
   if (sid.unif & SID.UNIF.PROJECTION) str[k] += 'projection_matrix, '
   if (sid.unif & SID.UNIF.SCREEN_RESOLUTION) str[k] += 'screen_resolution, '
   if (sid.unif & SID.UNIF.ROOT_WPOS2) str[k] += 'ROOT_WPOS2, '
   if (sid.unif & SID.UNIF.TIME) str[k] += 'time, '
   if (sid.unif & SID.UNIF.COL4) str[k] += 'col4, '
   // if (sid.unif) str[k] += '\n'

   k++;
   if (sid.pass) str[k] += 'Passes:'
   if (sid.pass & SID.ATTR.COL4) str[k] += 'col4, '
   if (sid.pass & SID.ATTR.VPOS2) str[k] += 'pos2, '
   if (sid.pass & SID.ATTR.DIM2) str[k] += 'dim2, '
   if (sid.pass & SID.ATTR.WPOS2) str[k] += 'wpos2, '
   if (sid.pass & SID.ATTR.TEX2) str[k] += 'tex2, '
   if (sid.pass & SID.ATTR.TIME) str[k] += 'time1, '
   if (sid.pass & SID.ATTR.SDF2) str[k] += 'sdf2'
   if (sid.pass & SID.ATTR.STYLE3) str[k] += 'generir_attribs1'
   // if (sid.pass) str[k] += '\n'

   return str;
}

export function Sid_check_unif_match_sids(sid_unif, unif_name) {

   if(unif_name === 'u_col4') return (sid_unif & SID.UNIF.COL4) ? true : false;
   else if(unif_name === 'u_dim2') return (sid_unif & SID.UNIF.DIM2) ? true : false;
   else if(unif_name === 'u_scale2') return (sid_unif & SID.UNIF.U_SCALE_VEC2) ? true : false;
   else if(unif_name === 'u_wposxy') return (sid_unif & SID.UNIF.ROOT_WPOS2) ? true : false;
   else if(unif_name === 'u_time') return (sid_unif & SID.UNIF.TIME) ? true : false;

   return false;
}