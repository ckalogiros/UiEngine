"use strict";

import { Mesh_buffer_get_mesh_byidx, Widget_root_buffer_get_root_meshidx } from "../../Core/MeshBuffer";



export function Find_parent_listen_event(EVENT_TYPE_IDX, mesh){

   if(mesh.parent === null) return null;

   let current = mesh.parent;
   while(current){

      // Find the first parent with an event listener of type
      if(current.listeners !== null && current.listeners.buffer[EVENT_TYPE_IDX] !== null && current.listeners.buffer[EVENT_TYPE_IDX] !== INT_NULL){

         return current.listeners.buffer[EVENT_TYPE_IDX];
      }
      current = current.parent;
   }


   // If no parent listener is found:
   // 1. If mesh parent is of type section, cretae FAKE event listener
   // 2. Else create FAKE event listener at widget root

   if(mesh.parent && (mesh.parent.type & MESH_TYPE.SECTION_MESH)){

      mesh.parent.CreateListenEvent(mesh.event_flags, FAKE_LISTEN_EVENT);
      mesh.parent.AddListenEvent(EVENT_TYPE_IDX, null, null, null);
      return mesh.parent.listeners.buffer[EVENT_TYPE_IDX];
   }


   // Ceate FAKE event listener at widget root. 
   if(current === null){ // UNNECESSARY: I believe if break is not reached, then current will go to scene which is 'NO_MESH_PARENT'
      const root_meshidx = Widget_root_buffer_get_root_meshidx(mesh.root_bufferidx)
      current = Mesh_buffer_get_mesh_byidx(root_meshidx)
   }

   current.CreateListenEvent(mesh.event_flags, FAKE_LISTEN_EVENT);
   current.AddListenEvent(EVENT_TYPE_IDX, null, null, null);

   const parent_event_idx = current.listeners.buffer[EVENT_TYPE_IDX];
   return parent_event_idx;
}