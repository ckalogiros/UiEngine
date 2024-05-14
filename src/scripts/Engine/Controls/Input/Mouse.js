"use strict";

import { GetSign } from "../../../Helpers/Helpers.js";
import { Floor } from "../../../Helpers/Math/MathOperations.js";
import { Info_listener_dispatch_event } from "../../Drawables/DebugInfo/InfoListeners.js";
import { RegisterEvent } from "../../Events/Events.js";


const mouse = {

   /**
    * Why setting prev pos to INT_NULL:
    *    If the mouse leaves the 'html-body', the mouse.pos.prev stores the mouse pos, as it ought to do.
    *    Now if the mouse enters from a different x-y coordinate, then the xdiff is calculated as pos - prevPos,
    *    which takes into account the coordinates before the mouse leaved the 'html-body'.
    *    This produces huge ammounts of difference. To avoid that, whenever the mouse leaves the 'html-body' area,
    *    we set the prevPos to INT_NULL, so that uppon OnMouseMove() callback we check if the value is NOT INT_NULL 
    *    in order to procceed and do the dif calculation. If it is INT_NULL (means that mouse left the area), then we
    *    just store the new pos in the prevPos variable. 
    */

   pos: {
      x: 0, y: 0,
      xprev: INT_NULL, yprev: INT_NULL, // Mouse previous pos
      xdiff: 0, ydiff: 0, // Mouse pos difference form previous pos (in pixels)

      GetPos(){
         return [
            this.x,
            this.y,
         ];
      },
      GetDif(){
         return {
            x:Floor(this.xdiff),
            y:Floor(this.ydiff),
         };
      },
      GetPrevPos(){
         return {
            x:this.xprev,
            y:this.yprev,
         };
      },
      SetPos(x, y){
         this.x = x;
         this.y = y;
      },
      SetDif(x, y){
         this.xdiff = x;
         this.ydiff = y;
      },
      SetPrevPos(x, y){
         this.xprev = x;
         this.yprev = y;
      },
      ResetPos(){
         this.x = 0;
         this.y = 0;
      },
      ResetDif(){
         this.xdiff = 0;
         this.ydiff = 0;
      },
      DampenDif(factor){
         this.xdiff *= factor;
         this.ydiff *= factor;
      },
      ResetPrevPos(){
         this.xprev = 0;
         this.yprev = 0;
      },
   },
   click: {
      down:{
         btn: INT_NULL,   // Mouse Buttons. 0:Left, 1:Middle, 2:Right.
         x: 0, y: 0,
         xprev: 0, yprev: 0, // Mouse previous pos
         Set(btn){
            this.btn = btn;
            this.xprev = this.x;
            this.yprev = this.y;
            this.x =  mouse.pos.x;
            this.y =  mouse.pos.y;
            // console.log(this)
         }
      },
      up:{
         btn: INT_NULL,   // Mouse Buttons. 0:Left, 1:Middle, 2:Right.
         x: 0, y: 0,
         xprev: 0, yprev: 0, // Mouse previous pos
         Set(btn){
            this.btn = btn;
            this.xprev = this.x;
            this.yprev = this.y;
            this.x =  mouse.pos.x;
            this.y =  mouse.pos.y;
            // console.log(this)
         }
      },
      drag: {
         x:0,
         y:0,
         Area(){
            this.x = mouse.click.up.x - mouse.click.down.x;
            this.y = mouse.click.up.y - mouse.click.down.y;
            // console.log(this);
         }
      },
   },
   wheel: {
      x:0, // The mouse position at the time of the wheel scroll
      y:0, // The mouse position at the time of the wheel scroll
      delta: 0, // The - of the delta value is for scrolling up, the + is for down.
      Reset(){
         this.delta = 0;
      }
   }

   
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Getters-Setters 
 */

/**
 * 
 * @returns {Obj:{x,y}} 
 */
export function MouseGetPos() {
   return mouse.pos.GetPos();
}


export function MouseGetPosDif() {
   return {
      x:mouse.pos.xdiff,
      y:mouse.pos.ydiff,
   };;
}


export function MouseGetPosDifX() {
   return mouse.pos.xdiff;
}


export function MouseGetPosDifY() {
   return mouse.pos.ydiff;
}


function MouseGetDir() {
   return mouse.pos.GetDif();
}


function MouseGetXdir() {
   return mouse.pos.xdiff;
}


function MouseGetYdir() {
   return mouse.pos.ydiff;
}


function MouseGetArea() {
   return mouse.click.drag;
}


export function MouseResetDif(factor) {  // HOT-PATH
   mouse.pos.DampenDif(factor)
   // mouse.pos.ResetDif()
}


export function MouseGetWheel(){
   return mouse.wheel;
}


export function MouseResetWheel(){  // HOT-PATH
   mouse.wheel.Reset();
}





/**
 * Mouse Events
 */

export function MouseSetCoords(coord){
    
   mouse.pos.xprev = mouse.pos.x;
   mouse.pos.yprev = mouse.pos.y;

   mouse.pos.x = coord[0] - VIEWPORT.MARGIN.LEFT; 
   mouse.pos.y = coord[1] + VIEWPORT.MARGIN.TOP; 

   // mouse.pos.xdiff = mouse.pos.x - mouse.pos.xprev;
   // mouse.pos.ydiff = -(mouse.pos.y - mouse.pos.yprev); // Reverse the direction(negative for down dir and positive for up dir) 

}

export function OnMouseMove(e) {

   e.stopPropagation();
   e.preventDefault(); 

   const newPosX = e.clientX - VIEWPORT.MARGIN.LEFT;
   const newPosY = e.clientY + VIEWPORT.MARGIN.TOP;
   const oldPosx = mouse.pos.x;
   const oldPosy = mouse.pos.y;
   // console.log(newPosX, newPosY)
   
   mouse.pos.x = newPosX;
   mouse.pos.y = newPosY;
   
   if(mouse.pos.xprev !== INT_NULL){ // I think the if statement avoids mesh dissapear if mouse goes beyond the canvas 
      mouse.pos.xprev = oldPosx;
      mouse.pos.yprev = oldPosy;
   }
   else{
      mouse.pos.xprev = newPosX;
      mouse.pos.yprev = newPosY;
   }
   
   // NOTE: The *2 is required for google chrome browser.
   mouse.pos.xdiff = (mouse.pos.x - mouse.pos.xprev);
   mouse.pos.ydiff = -((mouse.pos.y - mouse.pos.yprev)); // Reverse the direction(negative for down dir and positive for up dir) 
   // console.log(mouse.pos.xdiff, mouse.pos.ydiff)

   RegisterEvent('mouse-move', null);

   // console.log(mouse.pos.x, mouse.pos.y)

   Info_listener_dispatch_event(INFO_LISTEN_EVENT_TYPE.MOUSE, { mouse: mouse });
}



export function OnMouseOut(e){
   
   e.stopPropagation();
   e.preventDefault();

   mouse.pos.SetPrevPos(INT_NULL, INT_NULL);
   mouse.pos.ResetPos();
}



export function OnMouseWheel(e){

   e.stopPropagation();
   e.preventDefault();

   // client.x-y, the mouse pos at the time of the wheel scroll 
   // wheelDelta for the sign (- wheel down, + wheel up) and the value probablyy represents the wheel move in pixels
   mouse.wheel.x = e.clientX;
   mouse.wheel.x =  e.clientY;
   mouse.wheel.delta = GetSign(e.wheelDelta);

   // console.log(`MOUSE WHEEL: pos: ${e.x} ${e.y}, delta: ${e.wheelDelta}`)
}



export function OnMouseDown(e) {
   
   e.stopPropagation();
   e.preventDefault(); 
   
   mouse.click.down.Set(e.which-1);
   
   const params = {
      mouseButton: e.which-1
   };
   
   RegisterEvent('mouse-click-down', params);
   // console.log(`MOUSE pos: ${e.x} ${e.y}`)
}



export function OnMouseUp(e) {
   
   e.stopPropagation();
   e.preventDefault(); 
   
   mouse.click.up.Set(e.which-1)
   mouse.click.drag.Area();
   
   const params = {
      mouseButton: e.which-1
   };

   RegisterEvent('mouse-click-up', params)
}



/***************************************************************************************************/
// ANDROID SCREEN EVENTS

/*
 * On Mouse Events 
 * When a touch screen exists, then on touchClick event both functions are called,
 * the OnMouseMove or OnMouseMove_Android event AND the onMouseClick event,
 * as the OnTouchStart and OnTouchEnd events. 
 */

export function OnMouseMove_Android(e) {
   MouseSetCoords([e.clientX, e.clientY]);
   console.log('OnMouseMove_Android: ', mouse.pos.x, mouse.pos.y)
}



/**
* Touchscreen Events
* 
* // https://developer.mozilla.org/en-US/docs/Games/Techniques/Control_mechanisms/Mobile_touch
* const el = document.querySelector("canvas");
* el.addEventListener("touchstart", handleStart);
* el.addEventListener("touchmove", handleMove);
* el.addEventListener("touchend", handleEnd);
* el.addEventListener("touchcancel", handleCancel);

* touchstart is fired when the user puts a finger on the screen.
* touchmove is fired when they move the finger on the screen while touching it
* touchend is fired when the user stops touching the screen
* touchcancel is fired when a touch is cancelled, for example when the user moves their finger out of the screen.
*/
export function OnTouchStart(e) {
   
   e.stopPropagation();
   e.preventDefault(); 

   const x = e.changedTouches[0].clientX;
   const y = e.changedTouches[0].clientY;
   MouseSetCoords([x,y]); // IMPORTANT: Must set the mouse position on click, because touch screens do not track any position
   console.log('OnTouchStart:', [x,y])
   
   mouse.click.down.Set(MOUSE.BTN_ID.LEFT);

   
   const params = {
      mouseButton: mouse.click.down,
   };
   
   RegisterEvent('mouse-click-down', params);

}



export function OnTouchEnd(e) {

   e.stopPropagation();
   e.preventDefault(); 
   
   const x = e.changedTouches[0].clientX;
   const y = e.changedTouches[0].clientY;
   MouseSetCoords([x,y]);
   console.log('OnTouchEnd:',[x, y]);

   mouse.click.down.Set(MOUSE.BTN_ID.LEFT);

   const params = {
      mouseButton: mouse.click.down,
   };
   
   RegisterEvent('mouse-click-up', params);
   // console.log(e);
}



export function OnTouchCancel(e) {
   e.stopPropagation();
   e.preventDefault(); 
   console.log(`OnTouchCancel`);
}


export function OnTouchMove(e) {
   e.stopPropagation();
   e.preventDefault(); 
   // console.log('OnTouchMove:',[e.changedTouches[0].clientX, e.changedTouches[0].clientY]);
   // Update mouse coordinates
   const x = e.changedTouches[0].clientX;
   const y = e.changedTouches[0].clientY;
   MouseSetCoords([x,y]);

   mouse.pos.xdiff = (mouse.pos.x - mouse.pos.xprev);
   mouse.pos.ydiff = -((mouse.pos.y - mouse.pos.yprev)); // Reverse the direction(negative for down dir and positive for up dir) 
   // console.log('updated mouse:',mouse.pos);
   
}

 