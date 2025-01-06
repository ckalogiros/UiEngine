"use strict";

import { New_generic_buffer, New_int8_buffer } from "../../../../Engine/Core/Buffers.js";
import { Create_rect_mesh } from "../../../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { WHITE, YELLOWR } from "../../../../Engine/Drawables/Material/Base/Colors.js";
import { Renderqueue_set_active } from "../../../../Engine/Renderers/Renderer/RenderQueue.js";
import { Gl_add_wpos_xy, Gl_add_wpos_y, Gl_set_alpha, Gl_set_wpos_xy, Gl_set_wpos_y } from "../../../../Graphics/Buffers/VertexBuffersOps.js";



export class Physics {

   constructor(velx=0, vely=0, accelx=0, accely=0, speed=1, ) {

      this.velx = velx;
      this.vely = vely;

      this.accelx = accelx;
      this.accely = accely;
      
      this.speed = speed;
      // this.mass = 0;
   }

   SetVelocityXY(velx, vely) { this.velx = velx; this.vely = vely; }
   // SetVelocityX(velx) { this.velx = velx; }
   // SetVelocityY(vely) { this.vely = vely; }
   
   GetVelocityXY() { return { x:this.velx, y: this.vely, } }
   // GetVelocityX() { return this.velx; }
   // GetVelocityY() { return this.vely; }

   SetAccelerationXY(accelx, accely) { this.accelx = accelx; this.accely = accely; }
   // SetAccelerationX(accelx) { this.accelx = accelx; }
   // SetAccelerationY(accely) { this.accely = accely; }

   SetSpeedX(speed) { this.speed = speed; }
} 


