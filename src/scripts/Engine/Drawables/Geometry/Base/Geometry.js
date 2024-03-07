"use strict";

import * as math from '../../../../Helpers/Math/MathOperations.js'
import * as glBufferOps from '../../../../Graphics/Buffers/GlBufferOps.js'

let _geometryId = 0;

export class Geometry2D {

    sid;
    pos = [0, 0, 0];
    dim = [0, 0];
    scale = [0, 0];
    defPos = [0, 0, 0];
    defDim = [0, 0];
    defScale = [0, 0];
    pos_dif = [0, 0]; // UNNECESSARY
    zIndex = 0;
    type = 0;
    num_faces;
    // pos_id; // An index to the Str_buffer. As a name is the name of the shader's world position attribute. 
    // dim_id; // An index to the Str_buffer. As a name is the name of the shader's vertex position attribute. 

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
        this.type |= MESH_TYPES_DBG.GEOMETRY2D;

        // this.pos_id = INT_NULL;
        // this.dim_id = INT_NULL;

        /** Debug properties */
        if (DEBUG.GEOMETRY) {
            Object.defineProperty(this, 'id', { value: _geometryId++ });
        }
    }

    /*******************************************************************************************************************************************************/
    // Graphics

    SetPosXYZ(pos, gfx, numFaces) {
        this.pos[0] = pos[0];
        this.pos[1] = pos[1];
        this.pos[2] = pos[2];
        glBufferOps.GlSetWpos(gfx, pos, numFaces);
    }
    SetPosXY(pos, gfx) {
        this.pos[0] = pos[0];
        this.pos[1] = pos[1];
        glBufferOps.GlSetWposXY(gfx, pos);
    }
    SetPosX(x, gfx, numFaces) {
        this.pos[0] = x;
        glBufferOps.GlSetWposX(gfx, x, numFaces);
    }
    SetPosY(y, gfx, numFaces) {
        this.pos[1] = y;
        glBufferOps.GlSetWposY(gfx, y, numFaces);
    }
    UpdatePosXYZ(gfx) {
        glBufferOps.GlSetWpos(gfx, this.pos);
    }
    UpdateFromPosXYZ(gfx, pos) {
        glBufferOps.GlSetWpos(gfx, pos);
    }
    UpdatePosXY(gfx) {
        glBufferOps.GlSetWposXY(gfx, this.pos);
    }
    SetDefaultPosXY(gfx) {
        this.pos[0] = this.defPos[0];
        this.pos[1] = this.defPos[1];
        glBufferOps.GlSetWposXY(gfx, this.defPos);
    }
    UpdatePosZ(z, gfx, numFaces) {
        this.pos[2] = z;
        glBufferOps.GlSetWposZ(gfx, z, numFaces);
    }
    MoveXYZ(pos, gfx, num_faces) {
        /**DEBUG ERROR*/ if (pos.length !== 3) console.error('Wrong array dimention for position xyz. @ class Geometry2D, Geometry.js')
        this.pos[0] += pos[0];
        this.pos[1] += pos[1];
        this.pos[2] += pos[2];
        glBufferOps.GlMoveXYZ(gfx, pos, num_faces);
    }
    MoveXY(x, y, gfx) {
        // if(x===0 && y===0) return;
        this.pos[0] += x;
        this.pos[1] += y;
        glBufferOps.GlMoveXY(gfx, [x, y], this.num_faces);
    }
    MoveX(x, gfx) {
        if(x===0) return;
        this.pos[0] += x;
        glBufferOps.GlMoveXY(gfx, [x, 0]);
    }
    MoveY(y, gfx) {
        if(y===0) return;
        this.pos[1] += y;
        glBufferOps.GlMoveXY(gfx, [0, y]);
    }
    //////////////////////////////////////////////////////////////
    SetDim(dim, gfx) {
        
        const dimentions = [0,0];
        
        if(dim[0] !== UNCHANGED) dimentions[0] = dim[0]; // Set x dimention
        else dimentions[0] = this.dim[0]; // else use the same x dimention
        
        if(dim[1] !== UNCHANGED) dimentions[1] = dim[1];
        else dimentions[1] = this.dim[1];
        
        math.CopyArr2(this.dim, dimentions);
        glBufferOps.GlSetDim(gfx, dimentions);
    }
    UpdateDim(gfx) {
        glBufferOps.GlSetDim(gfx, this.dim);
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

        this.type |= MESH_TYPES_DBG.GEOMETRY3D;

        /** Debug properties */
        if (DEBUG.GEOMETRY) {
            Object.defineProperty(this, 'id', { value: _geometryId++ });
        }
    }

    //////////////////////////////////////////////////////////////
    SetPos(pos, gfx) {
        math.CopyArr3(this.pos, pos);
        glBufferOps.GlSetWposXY(gfx, pos);
    }
    SetPosXY(pos, gfx) {
        math.CopyArr2(this.pos, pos);
        glBufferOps.GlSetWposXY(gfx, pos);
    }
    SetPosX(x, gfx) {
        this.pos[0] = x;
        glBufferOps.GlSetWposX(gfx, x);
    }
    SetPosY(y) {
        this.pos[1] = y;
        glBufferOps.GlSetWposY(gfx, y);
    }
    UpdatePosXY() {
        glBufferOps.GlSetWposXY(gfx, this.pos);
    }
    UpdatePosZ(z) {
        this.pos[2] = z;
        glBufferOps.GlSetWposZ(gfx, z);
    }
    //////////////////////////////////////////////////////////////
    StoreDefPos(pos) {
        math.CopyArr2(this.defPos, pos);
    }
}

