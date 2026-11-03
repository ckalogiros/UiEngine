
/*************************************************************************************************/
// Graphics Constants

const TRIG = {
   COS: 0,
   SIN: 0,

};
/** Rotation Matrices */
class ROTATION3D {
   RX = [
       1, 0, 0,
       0, TRIG.COS, -TRIG.SIN,
       0, TRIG.SIN, TRIG.COS,
   ];
   RY = [
       TRIG.COS, 0, TRIG.SIN,
       0, 1, 0,
       -TRIG.SIN, 0, TRIG.COS,
   ];
   RZ = [
       TRIG.COS, -TRIG.SIN, 0,
       TRIG.SIN, TRIG.COS, 0,
       0, 0, 1,
   ];

   Set(cos, sin) {

       this.RX[4] = cos;
       this.RX[5] = -sin;
       this.RX[7] = sin;
       this.RX[8] = cos;

       this.RY[0] = cos;
       this.RY[2] = -sin;
       this.RY[6] = sin;
       this.RY[8] = cos;

       this.RZ[0] = cos;
       this.RZ[1] = -sin;
       this.RZ[3] = sin;
       this.RZ[4] = cos;
   }

   SetRX(cos, sin) {
       this.RX[4] = cos;
       this.RX[5] = -sin;
       this.RX[7] = sin;
       this.RX[8] = cos;
   }
   SetRY(cos, sin) {
       this.RY[0] = cos;
       this.RY[2] = -sin;
       this.RY[6] = sin;
       this.RY[8] = cos;
   }
   SetRZ(cos, sin) {
       this.RZ[0] = cos;
       this.RZ[1] = -sin;
       this.RZ[3] = sin;
       this.RZ[4] = cos;
   }
}








const ROT3D = new ROTATION3D();

const RX3D = [
   1, 0, 0,
   0, TRIG.COS, -TRIG.SIN,
   0, TRIG.SIN, TRIG.COS,
];







const RY3D = [
   TRIG.COS, 0, TRIG.SIN,
   0, 1, 0,
   -TRIG.SIN, 0, TRIG.COS,
];








const RZ3D = [
   TRIG.COS, -TRIG.SIN, 0,
   TRIG.SIN, TRIG.COS, 0,
   0, 0, 1,
];

