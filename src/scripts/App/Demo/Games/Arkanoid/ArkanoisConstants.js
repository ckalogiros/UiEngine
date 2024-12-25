"use strict";


_CNT = 0x1;
export const ARK_STATE_IN_START = _CNT<<=0x1;
export const ARK_STATE_IN_GAME = _CNT<<=0x1;
export const ARK_STATE_IN_FINISH = _CNT<<=0x1;
export const ARK_STATE = {

   state: ARK_STATE_IN_START,

   SET(flag) {
      this.state = flag;
   }
};

