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
export function Align_self_get_dif(flags, src_mesh, dst_mesh, pad = [0, 0], advancex=1) {

    const pos = [0,0];
    // Check if any of the acceptable ALIGN flags are passed.
    if((flags & (ALIGN.TOP | ALIGN.BOTTOM | ALIGN.LEFT | ALIGN.RIGHT)) === 0) {
        console.warn('NO APROPRIATE ALIGN FLAG IS PASSED');
        return pos;
    }

    const src_num_faces=src_mesh.num_faces, dst_num_faces=dst_mesh.num_faces;


    const s = {
        x:src_mesh.pos[0], y:src_mesh.pos[1],
        w:src_mesh.dim[0]*advancex*src_num_faces, h:src_mesh.dim[1],
    };

    const d = {
        x:dst_mesh.pos[0], y:dst_mesh.pos[1],
        d:dst_mesh.dim[0], h:dst_mesh.dim[1],
        w:dst_mesh.dim[0]*advancex*dst_num_faces*2,
    };

    if (flags & (ALIGN.VERT_CENTER)){
        pos[0] = d.x;
    }
    if (flags & (ALIGN.HOR_CENTER)){
        pos[1] = d.y;
    }


    if (flags & (ALIGN.LEFT)){
        // pos[0] = ((b.x-b.w)-p.x) + p.w/2;
    }
    else if (flags & (ALIGN.RIGHT)){
        pos[0] = (s.x+s.w) - d.d - pad[0];
        // pos[0] = (s.x);
    }
    if (flags & (ALIGN.TOP)){
        pos[1] = d.y - ((s.y + s.h) - d.h);
    }
    else if (flags & (ALIGN.BOTTOM)){
        pos[1] = d.y - ((s.y - s.h) + d.h);
    }


    return pos;
}


