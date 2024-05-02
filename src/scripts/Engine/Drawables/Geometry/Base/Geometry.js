"use strict";

import * as math from '../../../../Helpers/Math/MathOperations.js'
import * as glBufferOps from '../../../../Graphics/Buffers/VertexBuffersOps.js'

let _geometryId = 0;

export class Geometry2D {

    sid;
    pos = [0, 0, 0];
    dim = [0, 0];
    scale = [0, 0];
    defPos = [0, 0, 0];
    defDim = [0, 0];
    defScale = [0, 0];
    zIndex = 0;
    type = 0;
    num_faces;

    constructor(pos = [0, 0, 0], dim = [0, 0], scale = [1, 1]) {

        this.sid = {
            shad: 0,
            attr: (SID.ATTR.POS2 | SID.ATTR.WPOS_TIME4),
            unif: 0,
            pass: 0,
        };


        math.CopyArr3(this.pos, pos);
        math.CopyArr2(this.dim, dim);
        math.CopyArr2(this.scale, scale);


        // Keep a copy of the starting dimention and position
        math.CopyArr2(this.defDim, dim);
        math.CopyArr2(this.defScale, scale);
        math.CopyArr3(this.defPos, pos);
        this.zIndex = this.pos[2];  // Store default z index value. 

        this.num_faces = 1;
        this.type |= MESH_TYPE.GEOMETRY2D;

    }

    /*******************************************************************************************************************************************************/
    // Graphics

    SetPosXYZ(pos, gfx, numFaces)   { glBufferOps.Gl_set_wpos_XYZ   (gfx, pos[0] + this.dim[0], pos[1] + this.dim[1], pos[2], numFaces); }
    SetPosXY(pos, gfx)              { glBufferOps.Gl_set_wpos_XY    (gfx, pos[0] + this.dim[0], pos[1] + this.dim[1]); }
    SetPosX(x, gfx, numFaces)       { glBufferOps.Gl_set_wpos_X     (gfx, x + this.dim[0], numFaces); }
    SetPosY(y, gfx, numFaces)       { glBufferOps.Gl_set_wpos_Y     (gfx, y + this.dim[1], numFaces); }
    UpdatePosXYZ(gfx)               { glBufferOps.Gl_set_wpos_XYZ   (gfx, this.pos[0] + this.dim[0], this.pos[1] + this.dim[1], this.pos[2]); }
    UpdateFromPosXYZ(gfx, pos)      { glBufferOps.Gl_set_wpos_XYZ   (gfx, pos[0] + this.dim[0], pos[1] + this.dim[1], pos[2]); }
    UpdatePosXY(gfx)                { glBufferOps.Gl_set_wpos_XY    (gfx, this.pos[0] + this.dim[0], pos[1] + this.dim[1]); }
    SetDefaultPosXY(gfx)            { glBufferOps.Gl_set_wpos_XY    (gfx, this.pos[0] + this.dim[0], this.pos[1] + this.dim[1], this.pos[2]); }
    UpdatePosZ(z, gfx, numFaces)    { glBufferOps.Gl_set_wpos_Z     (gfx, z, numFaces); }
    MoveXYZ(pos, gfx, num_faces)    { glBufferOps.Gl_add_wpos_XYZ   (gfx, pos[0] + this.dim[0], pos[1] + this.dim[1], pos[2], num_faces); }
    MoveXY(x, y, gfx)   { if (x === 0 && y === 0) return; glBufferOps.Gl_add_wpos_XY(gfx, [x + this.dim[0], y + this.dim[1]], this.num_faces); }
    MoveX(x, gfx)       { if (x === 0) return; glBufferOps.Gl_add_wpos_X(gfx, x); }
    MoveY(y, gfx)       { if (y === 0) return; glBufferOps.Gl_add_wpos_Y(gfx, y); }
    //////////////////////////////////////////////////////////////
    SetDim(dim, gfx) {

        const dimentions = [0, 0];

        if (dim[0] !== UNCHANGED) dimentions[0] = dim[0]; // Set x dimention
        else dimentions[0] = this.dim[0]; // else use the same x dimention

        if (dim[1] !== UNCHANGED) dimentions[1] = dim[1];
        else dimentions[1] = this.dim[1];

        math.CopyArr2(this.dim, dimentions);
        glBufferOps.Gl_set_dim_XY(gfx, dimentions);
    }
    UpdateDim(gfx) {
        glBufferOps.Gl_set_dim_XY(gfx, this.dim);
    }
    UpdateScale() {
        glBufferOps.GlSetScale(gfx, this.scale);
    }
    SetScale(s) {
        this.scale[0] *= s;
        this.scale[1] *= s;
        glBufferOps.GlSetScale(gfx, this.scale);
    }
    ScaleFromVal(val) {
        this.scale[0] *= val;
        this.scale[1] *= val;
        glBufferOps.GlSetScale(gfx, this.scale);
        // Also set dim to mirror the scale
        this.dim[0] *= val;
        this.dim[1] *= val;
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
            this.zIndex = geom.zIndex;
            this.type = geom.type;
            this.num_faces = geom.num_faces;
        }
    }
}


export class Geometry3D {

    sid;
    pos = [0, 0, 0];
    dim = [0, 0, 0];
    scale = [0, 0, 0];
    zIndex = 0;
    type;

    constructor(pos = [0, 0, 0], dim = [0, 0, 0], scale = [1, 1, 1]) {

        this.sid = {
            shad: 0,
            attr: (SID.ATTR.POS3 | SID.ATTR.WPOS_TIME4),
            unif: 0,
            pass: 0,
        };


        math.CopyArr3(this.pos, pos);
        math.CopyArr3(this.dim, dim);
        math.CopyArr3(this.scale, scale);
        this.zIndex = this.pos[2]; // Store default z index value. 

        this.type |= MESH_TYPE.GEOMETRY3D;

        /** Debug properties */
        if (DEBUG.GEOMETRY) {
            Object.defineProperty(this, 'id', { value: _geometryId++ });
        }
    }

    // //////////////////////////////////////////////////////////////
    // SetPos(pos, gfx) {
    //     math.CopyArr3(this.pos, pos);
    //     glBufferOps.Gl_set_wpos_XY(gfx, pos);
    // }
    // SetPosXY(pos, gfx) {
    //     math.CopyArr2(this.pos, pos);
    //     glBufferOps.Gl_set_wpos_XY(gfx, pos);
    // }
    // SetPosX(x, gfx) {
    //     this.pos[0] = x;
    //     glBufferOps.Gl_set_wpos_X(gfx, x);
    // }
    // SetPosY(y) {
    //     this.pos[1] = y;
    //     glBufferOps.Gl_set_wpos_Y(gfx, y);
    // }
    // UpdatePosXY() {
    //     glBufferOps.Gl_set_wpos_XY(gfx, this.pos);
    // }
    // UpdatePosZ(z) {
    //     this.pos[2] = z;
    //     glBufferOps.Gl_set_wpos_Z(gfx, z);
    // }
    // //////////////////////////////////////////////////////////////
    // StoreDefPos(pos) {
    //     math.CopyArr2(this.defPos, pos);
    // }
}

