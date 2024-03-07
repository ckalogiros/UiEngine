"use strict";

import { CopyArr2 } from "../../../Helpers/Math/MathOperations";


/**
 * 
 * @param {*} flags 
 * @param {*} first_mesh 
 * @param {*} second_mesh 
 * @param {*} pad 
 */

export function Align_between(flags, first_mesh, second_mesh, first_pad = [0, 0], second_pad = [0, 0], advancex) {

    // Check if any of the acceptable ALIGN flags are passed.
    if((flags & (ALIGN.VERTICAL | ALIGN.HORIZONTAL)) === 0) {
        console.warn('NO APROPRIATE ALIGN FLAG IS PASSED');
        return;
    }


    const first_num_faces=first_mesh.num_faces, second_num_faces=second_mesh.num_faces; 
    // const dif = first_num_faces*2*advancex;
    // const w = (first_mesh.dim[0])*first_num_faces*2;
    const w = (first_mesh.dim[0]*advancex)*first_num_faces*2;

    if(flags & ALIGN.VERTICAL){
        second_mesh.pos[0] = first_mesh.dim[0];
        second_mesh.pos[1] = first_mesh.pos[1];
        second_mesh.pos[1] += (first_mesh.dim[1] + first_pad[1]) + second_mesh.dim[1];
    }
    else if(flags & ALIGN.HORIZONTAL){
        second_mesh.pos[0] = first_mesh.pos[0] + first_pad[0];
        // second_mesh.pos[0] += (w+first_mesh.dim[0] + first_pad[0]) + (second_mesh.dim[0] + second_pad[0]);
        // second_mesh.pos[0] += (w + first_pad[0]);
        second_mesh.pos[0] += (w + second_pad[0]);
        second_mesh.pos[1] = first_mesh.pos[1];
    }
}





/**
 * Align only to the top-bottom, left-right relative to src_mesh rectangle
 * @param {BIT_FIELD} flags type of struct ALIGN
 * @param {src_mesh.geom} src_mesh type of: Geometry2D
 * @param {dst_mesh.geom} dst_mesh type of: Geometry2D
 * @param {arr[2]} pad type of: int arr[2] | default values if not set:[0,0]
 */

// TODO: Rename the function name to something representative
export function Align_self(flags, src_mesh, dst_mesh, pad = [0, 0], advancex) {

    let move_dif = [0,0];
    // Check if any of the acceptable ALIGN flags are passed.
    if((flags & (ALIGN.TOP | ALIGN.BOTTOM | ALIGN.LEFT | ALIGN.RIGHT)) === 0) {
        console.warn('NO APROPRIATE ALIGN FLAG IS PASSED');
        return move_dif;
    }

    const src_num_faces=src_mesh.num_faces, dst_num_faces=dst_mesh.num_faces;


    const b = {
        x:src_mesh.pos[0], y:src_mesh.pos[1],
        w:src_mesh.dim[0]*advancex*src_num_faces*2, h:src_mesh.dim[1],
    };

    const p = {
        x:dst_mesh.pos[0], y:dst_mesh.pos[1],
        d:dst_mesh.dim[0], h:dst_mesh.dim[1],
        w:dst_mesh.dim[0]*advancex*dst_num_faces*2,
    };

    if (flags & (ALIGN.LEFT)){
        // move_dif[0] = ((b.x-b.w)-p.x) + p.w/2;
    }
    else if (flags & (ALIGN.RIGHT)){
        move_dif[0] = (b.x+b.w)-(p.w)-p.d;
    }
    if (flags & (ALIGN.TOP)){
        move_dif[1] = p.y - ((b.y + b.h) - p.h);
    }
    else if (flags & (ALIGN.BOTTOM)){
        move_dif[1] = p.y - ((b.y - b.h) + p.h);
    }
    return move_dif;
}
