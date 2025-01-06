"use strict";


// _CNT = 0x1;
// export const ARK_STATE_IN_START = _CNT<<=0x1;
// export const ARK_STATE_IN_GAME = _CNT<<=0x1;
// export const ARK_STATE_IN_FINISH = _CNT<<=0x1;
// export const ARK_STATE = {

//    state: ARK_STATE_IN_START,

//    SET(flag) {
//       this.state = flag;
//    }
// };
_CNT = 0x1;
export const ARK_STATE = {
   
   IN_START: _CNT,
   IN_GAME: _CNT<<=0x1,
   IN_FINISH: _CNT<<=0x1,

   FIRE_BULLET_ENABLED: _CNT<<=0x1,
   GUN_ENABLED: _CNT<<=0x1,

   state: 0x0,

   RESET(flag) { this.state = flag; },
   ADD(flag) { this.state |= flag; },
   REMOVE(flag) { this.state &= ~flag; },

   IS(flag) { return flag & this.state; }
};

ARK_STATE.RESET(ARK_STATE.IN_START);

