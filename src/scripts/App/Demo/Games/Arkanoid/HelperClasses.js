"use strict";



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

