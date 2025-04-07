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