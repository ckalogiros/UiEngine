"use strict";

import { GetSign } from "../../../../Helpers/Helpers.js";




export class Physics {

   constructor(velx = 0, vely = 0, accelx = 0, accely = 0, speed = 1,) {

      this.velx = velx;
      this.vely = vely;

      this.accelx = accelx;
      this.accely = accely;

      this.speed = speed;
      // this.mass = 0;

      this.signx = GetSign(accelx); // The x direction
      this.signy = GetSign(accely); // The y direction
   }

   Reset(velx = 0, vely = 0, accelx = 0, accely = 0, speed = 1) {
      this.velx = velx;
      this.vely = vely;

      this.accelx = accelx;
      this.accely = accely;

      this.speed = speed;

      this.signx = GetSign(accelx);
      this.signy = GetSign(accely);
   }

   SetVelocityXY(velx, vely) { this.velx = velx; this.vely = vely; }
   GetVelocityXY() { return { x: this.velx, y: this.vely, } }
   SetAccelerationXY(accelx, accely) { this.accelx = accelx; this.accely = accely; }
   SetSpeedX(speed) { this.speed = speed; }
}


