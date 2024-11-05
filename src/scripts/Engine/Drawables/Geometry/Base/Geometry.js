"use strict";

import * as math from '../../../../Helpers/Math/MathOperations.js'
import * as glBufferOps from '../../../../Graphics/Buffers/VertexBuffersOps.js'









export class Geometry2D {

    constructor(pos = [0, 0, 0], dim = [0, 0], scale = [1, 1], num_faces=1) {

        this.pos = [0, 0, 0];
        this.dim = [0, 0];
        this.scale = [0, 0];
        this.defPos = [0, 0, 0];
        this.defDim = [0, 0];
        this.defScale = [0, 0];
        this.time = 1;
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
        
        // if(num_faces>1) dim1[0] = dim[0]/num_faces; // (Example: for color hue)
        math.CopyArr3(this.pos, math.FloorArr3(pos));
        math.CopyArr2(this.dim, dim1);
        math.CopyArr2(this.scale, scale);


        // Keep a copy of the starting dimention and position
        math.CopyArr2(this.defDim, dim1);
        math.CopyArr2(this.defScale, scale);
        math.CopyArr3(this.defPos, this.pos);


    }

    SetDefaultPosXY(gfx)    { glBufferOps.Gl_set_wpos_xy    (gfx, this.pos[0], this.pos[1], this.pos[2]); }

    AddDimXY    (gfx, x, y, num_faces=1)    { glBufferOps.Gl_add_vpos_xy(gfx, x, y, num_faces); }
    AddDimX     (gfx, x   , num_faces=1)    { glBufferOps.Gl_add_vpos_x( gfx, x, num_faces); }
    AddDimY     (gfx, y   , num_faces=1)    { glBufferOps.Gl_add_vpos_y( gfx, y, num_faces); }
    SetDimXY    (gfx, x, y, num_faces=1)    { glBufferOps.Gl_set_vpos_xy(gfx, x, y, num_faces); }
    SetDimX     (gfx, x   , num_faces=1)    { glBufferOps.Gl_set_vpos_x( gfx, x, num_faces); }
    SetDimY     (gfx, y   , num_faces=1)    { glBufferOps.Gl_set_vpos_y( gfx, y, num_faces); }

    UpdateAddDimXY  (gfx, num_faces=1)  { glBufferOps.Gl_add_vpos_xy(gfx, this.dim[0], this.dim[1], num_faces); }
    UpdateAddDimX   (gfx, num_faces=1)  { glBufferOps.Gl_add_vpos_x( gfx, this.dim[0], num_faces); }
    UpdateAddDimY   (gfx, num_faces=1)  { glBufferOps.Gl_add_vpos_y( gfx, this.dim[1], num_faces); }
    UpdateSetDimXY  (gfx, num_faces=1)  { glBufferOps.Gl_set_vpos_xy(gfx, this.dim[0], this.dim[1], num_faces); }
    UpdateSetDimX   (gfx, num_faces=1)  { glBufferOps.Gl_set_vpos_x( gfx, this.dim[0], num_faces); }
    UpdateSetDimY   (gfx, num_faces=1)  { glBufferOps.Gl_set_vpos_y( gfx, this.dim[1], num_faces); }

    UpdateAddWposXY (gfx, num_faces=1)  { glBufferOps.Gl_add_wpos_xy(gfx, this.pos[0], this.pos[1], num_faces); }
    UpdateAddWposX  (gfx, num_faces=1)  { glBufferOps.Gl_add_wpos_x( gfx, this.pos[0], num_faces); }
    UpdateAddWposY  (gfx, num_faces=1)  { glBufferOps.Gl_add_wpos_y( gfx, this.pos[1], num_faces); }
    UpdateSetWposXY (gfx, num_faces=1)  { glBufferOps.Gl_set_wpos_xy(gfx, this.pos[0], this.pos[1], num_faces); }
    UpdateSetWposX  (gfx, num_faces=1)  { glBufferOps.Gl_set_wpos_x( gfx, this.pos[0], num_faces); }
    UpdateSetWposY  (gfx, num_faces=1)  { glBufferOps.Gl_set_wpos_y( gfx, this.pos[1], num_faces); }
    
    AddWposXY   (gfx, x, y, num_faces=1)    { glBufferOps.Gl_add_wpos_xy(gfx, x, y, num_faces); }
    AddWposX    (gfx, x   , num_faces=1)    { glBufferOps.Gl_add_wpos_x( gfx, x, num_faces); }
    AddWposY    (gfx, y   , num_faces=1)    { glBufferOps.Gl_add_wpos_y( gfx, y, num_faces); }
    SetWposXY   (gfx, x, y, num_faces=1)    { glBufferOps.Gl_set_wpos_xy(gfx, x, y, num_faces); }
    SetWposX    (gfx, x   , num_faces=1)    { glBufferOps.Gl_set_wpos_x( gfx, x, num_faces); }
    SetWposY    (gfx, y   , num_faces=1)    { glBufferOps.Gl_set_wpos_y( gfx, y, num_faces); }

    
    SetDim(dim, gfx) {

        const dimentions = [0, 0];

        if (dim[0] !== UNCHANGED) dimentions[0] = dim[0]; // Set x dimention
        else dimentions[0] = this.dim[0]; // else use the same x dimention

        if (dim[1] !== UNCHANGED) dimentions[1] = dim[1];
        else dimentions[1] = this.dim[1];

        math.CopyArr2(this.dim, dimentions);
        glBufferOps.Gl_set_vpos_xy(gfx, dimentions[0], dimentions[1]);
    }


    StoreDefPos(pos) {
        math.CopyArr2(this.defPos, pos);
    }


    Copy(geom = {}) {

        if (geom instanceof Geometry2D) {

            this.shad = geom.sid.shad;
            this.attr = geom.sid.attr;
            this.unif = geom.sid.unif;
            this.pass = geom.sid.pass;
            math.CopyArr3(this.pos, geom.pos);
            math.CopyArr2(this.dim, geom.dim);
            math.CopyArr2(this.scale, geom.scale);
            math.CopyArr3(this.defPos, geom.defPos);
            math.CopyArr2(this.defDim, geom.defDim);
            math.CopyArr2(this.defScale, geom.defScale);
            this.type = geom.type;
            this.num_faces = geom.num_faces;
        }
    }
}


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

