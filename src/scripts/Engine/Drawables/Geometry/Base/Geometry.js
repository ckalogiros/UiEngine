"use strict";

import * as math from '../../../../Helpers/Math/MathOperations.js'


/** */
export class Geometry2D {

    constructor(pos = [0, 0, 0], dim = [0, 0], scale = [1, 1], num_faces=1) {

        this.pos = [0, 0, 0];
        this.dim = [0, 0];
        this.scale = [0, 0];
        this.defPos = [0, 0, 0];
        this.defDim = [0, 0];
        this.defScale = [0, 0];
        this.time = 1;
        this.generic = {a:0,b:0};
        this.num_faces = num_faces;
        this.type = MESH_TYPE.GEOMETRY2D;
        
        this.sid = {
            shad: SID.SHAD.INDEXED_PATT_DISCONTINUE_4,
            attr: (SID.ATTR.VPOS2 | SID.ATTR.WPOS3),
            inst: 0x0,
            unif: 0,
            pass: 0,
        };

        const dim1 = dim;
        
        math.CopyArr3(this.pos, math.FloorArr3(pos));
        math.CopyArr2(this.dim, dim1);
        math.CopyArr2(this.scale, scale);

        // Keep a copy of the starting dimention and position
        math.CopyArr2(this.defDim, dim1);
        math.CopyArr2(this.defScale, scale);
        math.CopyArr3(this.defPos, this.pos);


    }
}
/** */
export class Geometry2D_Text extends Geometry2D {

    constructor(pos=[0,0,0], text='', size) {
 
       super(pos, [size, size]);
       this.font_size = size;
       this.text = text;
       this.num_faces = text.length;
       this.type |= MESH_TYPE.TEXT_GEOMETRY2D;
    }
 }
/** */
export class Geometry3D {

    constructor(pos = [0, 0, 0], dim = [0, 0, 0], scale = [1, 1, 1]) {

        this.pos = [0, 0, 0];
        this.dim = [0, 0, 0];
        this.scale = [0, 0, 0];


        this.sid = {
            shad: 0,
            attr: (SID.ATTR.POS3 | SID.ATTR.WPOS3),
            unif: 0,
            pass: 0,
        };


        math.CopyArr3(this.pos, pos);
        math.CopyArr3(this.dim, dim);
        math.CopyArr3(this.scale, scale);

        this.type |= MESH_TYPE.GEOMETRY3D;

    }


}

