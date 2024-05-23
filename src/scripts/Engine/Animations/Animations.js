"use strict";

import { Gl_batch_set_RGBA, Gl_batch_set_pos_xy } from "../../Graphics/Buffers/VertexBuffersOps";
import { New_generic_buffer } from "../Core/Buffers";
import { Str_buffer_get_by_idx, Str_buffer_store } from "../Core/StringBuffer";


const MASKS = [
    0x1,
    0x2,
    0x3,
    0x4,
];


const ANIM_DATA = {
    T: 0,
    STEP: 1,
    MIN: 2,
    MAX: 3,
};



function Animations_get_type_to_string(anim_type_flag){
    if(anim_type_flag & ANIMATIONS.TYPE.COLOR) return 'COLOR';
}

function Animations_get_value_size(anim_type_flag, anim_data_type){
    if(anim_type_flag & ANIMATIONS.TYPE.COLOR){
        if(anim_data_type & ANIMATIONS.DATA.COLOR.R) return 1;
        if(anim_data_type & ANIMATIONS.DATA.COLOR.G) return 1;
        if(anim_data_type & ANIMATIONS.DATA.COLOR.B) return 1;
        if(anim_data_type & ANIMATIONS.DATA.COLOR.A) return 1;

        if(anim_data_type & ANIMATIONS.DATA.COLOR.RG) return 2;
        if(anim_data_type & ANIMATIONS.DATA.COLOR.RB) return 2;
        if(anim_data_type & ANIMATIONS.DATA.COLOR.RA) return 2;
        if(anim_data_type & ANIMATIONS.DATA.COLOR.GB) return 2;
        if(anim_data_type & ANIMATIONS.DATA.COLOR.GA) return 2;
        if(anim_data_type & ANIMATIONS.DATA.COLOR.BA) return 2;

        if(anim_data_type & ANIMATIONS.DATA.COLOR.RGB) return 3;
        if(anim_data_type & ANIMATIONS.DATA.COLOR.RGA) return 3;
        if(anim_data_type & ANIMATIONS.DATA.COLOR.RBA) return 3;
        if(anim_data_type & ANIMATIONS.DATA.COLOR.GBA) return 3;

        if(anim_data_type & ANIMATIONS.DATA.COLOR.RGBA) return 4;
    }
    else if(anim_type_flag & ANIMATIONS.TYPE.WPOS){
        if(anim_data_type & ANIMATIONS.DATA.POS.XY) return 2;
        if(anim_data_type & ANIMATIONS.DATA.POS.X) return 1;
        if(anim_data_type & ANIMATIONS.DATA.POS.Y) return 1;
    }
    alert('No apropriate size found for Animations value data size\nAnimations.js')
}

function Animations_get_value_offset(anim_type_flag, anim_data_type){

    let offsets = [];
    if(anim_type_flag & ANIMATIONS.TYPE.COLOR){

        if(anim_data_type & ANIMATIONS.DATA.COLOR.R) offsets.push(0);
        if(anim_data_type & ANIMATIONS.DATA.COLOR.G) offsets.push(1);
        if(anim_data_type & ANIMATIONS.DATA.COLOR.B) offsets.push(2);
        if(anim_data_type & ANIMATIONS.DATA.COLOR.A) offsets.push(3);
        return offsets;
    }
    else if(anim_type_flag & ANIMATIONS.TYPE.WPOS){
        
        if(anim_data_type & ANIMATIONS.DATA.POS.X)  offsets.push(0);
        if(anim_data_type & ANIMATIONS.DATA.POS.Y)  offsets.push(1);
        if(anim_data_type & ANIMATIONS.DATA.POS.XY) offsets.push(0);
        return offsets;
    }
}
// function Animations_get_value_offset(anim_type_flag, anim_data_type){
//     // if(anim_type_flag & ANIMATIONS.TYPE.COLOR){

//     //     if(anim_data_type & ANIMATIONS.DATA.COLOR.R) return 0;
//     //     if(anim_data_type & ANIMATIONS.DATA.COLOR.G) return 1;
//     //     if(anim_data_type & ANIMATIONS.DATA.COLOR.B) return 2;
//     //     if(anim_data_type & ANIMATIONS.DATA.COLOR.A) return 3;
//     //     if(anim_data_type & ANIMATIONS.DATA.COLOR.RG) return 0;
//     //     if(anim_data_type & ANIMATIONS.DATA.COLOR.RGB) return 0;
//     //     if(anim_data_type & ANIMATIONS.DATA.COLOR.RGBA) return 0;
//     //     alert('No apropriate size found for Animations color offset size\nAnimations.js')
//     // }
//     if(anim_type_flag & ANIMATIONS.TYPE.COLOR){

//         if(anim_data_type & ANIMATIONS.DATA.COLOR.R) return 0;
//         if(anim_data_type & ANIMATIONS.DATA.COLOR.G) return 1;
//         if(anim_data_type & ANIMATIONS.DATA.COLOR.B) return 2;
//         if(anim_data_type & ANIMATIONS.DATA.COLOR.A) return 3;
//         alert('No apropriate size found for Animations color offset size\nAnimations.js')
//     }
//     else if(anim_type_flag & ANIMATIONS.TYPE.WPOS){
        
//         if(anim_data_type & ANIMATIONS.DATA.POS.X) return 0;
//         if(anim_data_type & ANIMATIONS.DATA.POS.Y) return 1;
//         if(anim_data_type & ANIMATIONS.DATA.POS.XY) return 0;
//         alert('No apropriate size found for Animations wpos offset size\nAnimations.js')
//     }
// }



function Choose_update_callback(anim_type_flag){
    if(anim_type_flag & ANIMATIONS.TYPE.COLOR) return Gl_batch_set_RGBA;
    if(anim_type_flag & ANIMATIONS.TYPE.WPOS) return Gl_batch_set_pos_xy;

}





class VB_DATA {

    // constructor(vbidx, vb_offset, vb_attribs_count, values_len){
    constructor(vbidx, attribsidx, values_len){

        // this.vb_offset = vb_offset;
        // this.vb_attribs_count = vb_attribs_count;
        this.vbidx = vbidx;
        this.attribsidx = attribsidx;
        this.values_len = values_len;
        this.data = {
            starts: [],
            values: [],
            values_indices: [],
            num_faces: [],
            offsets: [],
        };
        this.data_count = 0;
    }

    SetData(start, values, num_faces, anim_type_flag, anim_data_type){
        if(values.constructor !== Array) alert('values should be an array\nAnimations.js')
        

        this.data.starts.push(start);
        this.data.num_faces.push(num_faces);
        
        
        this.data.offsets = Animations_get_value_offset(anim_type_flag, anim_data_type);
        for(let i=0; i < this.values_len; i++){
            
            this.data.values[this.data_count] = values[i];

            const mask = 0x1111
            // this.data.offsets[this.data_count] = Animations_get_value_offset(anim_type_flag, anim_data_type<<i+1);
            // this.data.offsets[this.data_count] = Animations_get_value_offset(anim_type_flag, anim_data_type & (mask<<0));
            // console.log(
            //     'anim_data_type', anim_data_type,
            //     '\ni', i,
            //     '\n(mask<<i)', (mask<<i),
            //     '\nmask<<i', anim_data_type & (mask<<i),
            // )
            // console.log(
            //     'anim_data_type', anim_data_type,
            //     '\n<<0', anim_data_type & (mask<<0),
            //     '\n<<1', anim_data_type & (mask<<1),
            //     '\n<<2', anim_data_type & (mask<<2),
            //     '\n&0x1', anim_data_type & 0x1,
            //     '\n&0x2', anim_data_type & 0x2,
            //     '\n&0x3', anim_data_type & 0x3,
            //     '\n&i', anim_data_type & MASKS[i],
            //     '\nR', ANIMATIONS.DATA.COLOR.R,
            //     '\nG', ANIMATIONS.DATA.COLOR.G,
            //     '\nB', ANIMATIONS.DATA.COLOR.B,
            //     '\nA', ANIMATIONS.DATA.COLOR.A,
            // )
            this.data_count++;
        }
        
        
        // For now values_indices is 1 to 1 with the values
        this.data.values_indices.push((this.data_count/this.values_len)-1); // RGBA:4 values -> values_indices = 4/4-1=0idx, next 8/4-1=1idx, next 12/4-1=2idx, ... 
    }
}
class AnimationData {

    constructor(){

        this.data = [];
    }

    SetData(t, step, min, max){
        this.data.push(t, step, min, max);
    }
}





export class Animation{

    // constructor(anim_type_flag, mesh_data, time_step, value_step, value_limits){
    // constructor(animationClbk=null, stopAnimationClbk=null, vb_data=null, anim_data=null, anim_type_flag){
    constructor(anim_type_flag=0x0, anim_data_type){
        
        this.vb_data = []; 
        this.anim_data = [];
        // this.animationClbk = animationClbk;
        // this.stopAnimationClbk = stopAnimationClbk;
        this.UpdateClbk = null;
        this.is_active = false;
        this.in_animation = false;
        this.anim_type_flag = anim_type_flag;
        this.nameidx = Str_buffer_store(Animations_get_type_to_string(anim_type_flag));
    }

    SetVbData(vb_data){
        const idx = this.vb_data.push(vb_data)-1;
        return idx;
    }

    SetAnimData(anim_data){
        this.anim_data.push(anim_data);
    }


}






// const _animations = new Animations;
const _animations = New_generic_buffer();



export function AnimationsGet(){ return _animations; }


function Vb_data_exist(anim_type_idx, vbidx){
    
    if(_animations.buffer[anim_type_idx].vb_data === null) return INT_NULL;

    if(_animations.buffer[anim_type_idx].vb_data.vbidx === vbidx) return anim_type_idx;
    // const len = _animations.buffer[anim_type_idx].vb_data.length;
    // for (let i=0; i < len; i++){

    //     if(_animations.buffer[anim_type_idx].vb_data.vbidx === vbidx) return i;
    // }

    return INT_NULL;
}

function Analyze_flag(anim_type_flag, flag){

    if(anim_type_flag & ANIMATIONS.TYPE.COLOR){
        
        if(flag & ANIMATIONS.DATA.COLOR.R) return ANIMATIONS.DATA.COLOR.R;
        if(flag & ANIMATIONS.DATA.COLOR.G) return ANIMATIONS.DATA.COLOR.G;
        if(flag & ANIMATIONS.DATA.COLOR.B) return ANIMATIONS.DATA.COLOR.B;
        if(flag & ANIMATIONS.DATA.COLOR.A) return ANIMATIONS.DATA.COLOR.A;

        if(flag & ANIMATIONS.DATA.COLOR.RG) return (ANIMATIONS.DATA.COLOR.R|ANIMATIONS.DATA.COLOR.G);
        if(flag & ANIMATIONS.DATA.COLOR.RB) return (ANIMATIONS.DATA.COLOR.R|ANIMATIONS.DATA.COLOR.B);
        if(flag & ANIMATIONS.DATA.COLOR.RA) return (ANIMATIONS.DATA.COLOR.R|ANIMATIONS.DATA.COLOR.A);

        if(flag & ANIMATIONS.DATA.COLOR.GB) return (ANIMATIONS.DATA.COLOR.G|ANIMATIONS.DATA.COLOR.B);
        if(flag & ANIMATIONS.DATA.COLOR.GA) return (ANIMATIONS.DATA.COLOR.G|ANIMATIONS.DATA.COLOR.A);
        
        if(flag & ANIMATIONS.DATA.COLOR.BA) return (ANIMATIONS.DATA.COLOR.B|ANIMATIONS.DATA.COLOR.A);

        if(flag & ANIMATIONS.DATA.COLOR.RGB) return (ANIMATIONS.DATA.COLOR.R|ANIMATIONS.DATA.COLOR.G|ANIMATIONS.DATA.COLOR.B);
        if(flag & ANIMATIONS.DATA.COLOR.RGA) return (ANIMATIONS.DATA.COLOR.R|ANIMATIONS.DATA.COLOR.G|ANIMATIONS.DATA.COLOR.B);
        if(flag & ANIMATIONS.DATA.COLOR.RBA) return (ANIMATIONS.DATA.COLOR.R|ANIMATIONS.DATA.COLOR.G|ANIMATIONS.DATA.COLOR.B);
        if(flag & ANIMATIONS.DATA.COLOR.GBA) return (ANIMATIONS.DATA.COLOR.R|ANIMATIONS.DATA.COLOR.G|ANIMATIONS.DATA.COLOR.B);

        if(flag & ANIMATIONS.DATA.COLOR.RGBA) return (ANIMATIONS.DATA.COLOR.R|ANIMATIONS.DATA.COLOR.G|ANIMATIONS.DATA.COLOR.B|ANIMATIONS.DATA.COLOR.B);
    }
    else if(anim_type_flag & ANIMATIONS.TYPE.WPOS){
        alert('IMPLEMET FOR WPOS\nEEE\nAnimations.js')
        if(flag & ANIMATIONS.DATA.POS.XY) return 2;
        if(flag & ANIMATIONS.DATA.POS.X) return 1;
        if(flag & ANIMATIONS.DATA.POS.Y) return 1;
    }
    alert('No apropriate size found for Animations value data size\nAnimations.js')
}

// export function Animations_create(animationClbk, stopAnimationClbk, params, name){
// export function Animations_create(anim_type_flag=0x0, values_len_flag=0x0, mesh_data=null, step=0, min=0, max=0){
export function Animations_create(anim_type_flag=0x0, values_len_flag=0x0, mesh=null, step=0, min=0, max=0){
        

    const vbidx = mesh.gfx.vb.groupidx;
    const starts = mesh.gfx.vb.start;
    const attribs_per_vertex = mesh.gfx.attribsPerVertex;
    const attribsidx = mesh.gfx.prog.attribsidx;
    const num_faces = mesh.geom.num_faces;
    const values = mesh.mat.col;


    const vals_len_flag = Analyze_flag(anim_type_flag, values_len_flag)
    console.log('values_len_flag', values_len_flag, '\nvals_len_flag', vals_len_flag)
    
    // Create animation type, if does not exist 
    let anim = null
    if(ANIMATIONS.INDEX.COLOR !== INT_NULL){
        anim = _animations.buffer[ANIMATIONS.INDEX.COLOR];
    }
    else {
        
        anim = new Animation(anim_type_flag);
        const idx = _animations.Add(anim);
        ANIMATIONS.INDEX.COLOR = idx;
    }


    const anim_type_idx = ANIMATIONS.INDEX.COLOR;

    // const vbidx = mesh_data.vbidx;
    // const attribsidx = mesh_data.attribsidx;
    // const anim_data_size_len = ANIMATIONS.DATA.COLOR.RGBA;
    // const anim_data_size_len = ANIMATIONS.DATA.POS.X;
    const vals_len = Animations_get_value_size(anim_type_flag, values_len_flag)
    
    // const starts = mesh_data.start;
    // const values = mesh_data.values;
    // const num_faces = mesh_data.num_faces;
    
    const t = 0;
    const t_step = step;

    // Create vb data, if does't existt
    let vb_data_idx = Vb_data_exist(anim_type_idx, vbidx)
    if(vb_data_idx === INT_NULL){

        const vb_data = new VB_DATA(vbidx, attribsidx, vals_len);
        vb_data_idx = anim.SetVbData(vb_data);
        
        // vb and anim data supose to be 1 to 1 element count
        const anim_data = new AnimationData();
        anim.SetAnimData(anim_data);
    }

    // Finally, after type and vb are set, create the animation data for the mesh
    anim.vb_data[vb_data_idx].SetData(starts, values, num_faces, anim_type_flag, vals_len_flag)
    anim.anim_data[vb_data_idx].SetData(t, t_step, min, max)

    // Set apropriate callback
    anim.UpdateClbk = Choose_update_callback(anim_type_flag)

    anim.is_active = true;
    anim.in_animation = true;
    
    // return idx;

}



// function Min_max(value, anim_data, flags){

//     const step = anim_data[ANIM_DATA.STEP], min = anim_data[ANIM_DATA.MIN], max = anim_data[ANIM_DATA.MAX];


//     if(value+step > max || value+step < min) {

//         if(flags & ANIMATIONS.TYPE.CYCLICAL){
//             // continue in the oposite direction
//             anim_data[ANIM_DATA.STEP] *= -1;

//         }
//         else{

//             // Stop animation
//             // If no Stop() callback is stored, just remove anim_data and values_data 
//         }
//     };

//     value += step;
            
//     // console.log(step)
//     return value;

// }


function Min_max(values, anim_data, flags, values_len){

    const step = anim_data[ANIM_DATA.STEP], min = anim_data[ANIM_DATA.MIN], max = anim_data[ANIM_DATA.MAX];

    for(let i=0; i < values_len; i++){

        if(values[i]+step > max || values[i]+step < min) {
    
            if(flags & ANIMATIONS.TYPE.CYCLICAL){
                // continue in the oposite direction
                anim_data[ANIM_DATA.STEP] *= -1;
    
            }
            else{
    
                // Stop animation
                // If no Stop() callback is stored, just remove anim_data and values_data 
            }
        };
    
        // console.log(step)
        values[i] += step;
    }
}


export function Animations_run(){

    if(_animations.active_count===0) return;

    for(let i=0; i <= _animations.boundary; i++){
        
        if(_animations.buffer[i].is_active){
            if(_animations.buffer[i].in_animation){
                
                // _animations.buffer[i].in_animation = _animations.buffer[i].animationClbk(_animations.buffer[i].params);
                
                const len = _animations.buffer[i].vb_data.length;
                for(let j=0; j < len; j++){
                    
                    const vb_data = _animations.buffer[i].vb_data[j];
                    const anim_data = _animations.buffer[i].anim_data[j].data;
                    Min_max(vb_data.data.values, anim_data, _animations.buffer[i].anim_type_flag, vb_data.values_len)
                    
                    // vb_data.data.values[0] = Min_max(vb_data.data.values[0], anim_data, _animations.buffer[i].anim_type_flag)
                    // vb_data.data.values[1] = Min_max(vb_data.data.values[1], anim_data, _animations.buffer[i].anim_type_flag)
                    
                    // vb_data.data.values[2] = Min_max(vb_data.data.values[2], anim_data, _animations.buffer[i].anim_type_flag)
                    // console.log(vb_data.data.values[0])
                    // console.log(vb_data.data.values[0])
                    
                    _animations.buffer[i].UpdateClbk(vb_data.vbidx, vb_data.data.starts, vb_data.data.values, vb_data.data.values_indices, vb_data.values_len, vb_data.attribsidx, vb_data.data.num_faces, vb_data.data.offsets);
                    // Gl_batch_set_RGBA(vb_data.vbidx, vb_data.data.starts, vb_data.data.values, vb_data.data.values_indices, vb_data.values_len, vb_data.attribsidx, vb_data.data.num_faces);
                }
                

            }
            else{ // Here do stuf if animation stops
                // _animations.buffer[i].is_active = false;
                // _animations.buffer[i].stopAnimationClbk(_animations.buffer[i].params);
                console.log("ANIMATIONS STOP")
            }
        }
    }
}


/**********************************************************************************************************************************/
// Debug-Print

export function Animations_print(){

    console.log('boundary', _animations.boundary, 'size', _animations.size)
    for(let i=0; i <= _animations.boundary; i++){
        console.log(
            'type:', Animations_get_type_to_string(_animations.buffer[i].anim_type_flag),
            '\nname:', Str_buffer_get_by_idx(_animations.buffer[i].nameidx),
            '\nattribsidx:', _animations.buffer[i].vb_data.attribsidx,
            '\nvb_data', _animations.buffer[i].vb_data,
            '\nanim_data', _animations.buffer[i].anim_data,
        );
    }
}









/**SAVE OLD CODE */

// export class Animation{
    
//     constructor(animationClbk=null, stopAnimationClbk=null, params=null, name){
//         this.params = params;
//         this.animationClbk = animationClbk;
//         this.stopAnimationClbk = stopAnimationClbk;
//         this.is_active = false;
//         this.in_animation = false;
//         this.name = name;
//         this.nameidx = Str_buffer_store(name);
//     }



//     Create(animationClbk, stopAnimationClbk, params, index, name){
//         this.params = params;
//         this.animationClbk = animationClbk;
//         this.stopAnimationClbk = stopAnimationClbk;
//         this.index = index;
//         this.name = name;
//     }


//     Run(){
//         this.in_animation = this.animationClbk(this.params);
//     }


//     Stop(){
//         this.is_active = false;
//         this.stopAnimationClbk(this.params);
//     }

// }



// export class Animations{

//     animations = [];
//     count = 0;
//     size = MAX_ANIMATIONS_SIZE;


//     constructor(){

//         // this.Init();
//         for(let i=0; i<this.size; i++){
//             this.animations[i] = new Animation;
//             this.animations[i].Create(null, null, null);
//         }
//     }

    
//     GetNextFree() {
//         for (let i = 0; i < this.size; i++) {
//             if (!this.animations[i].is_active) {
//                 return i;
//             }
//         }
//         return INT_NULL;
//     }


//     Create(animationClbk, stopAnimationClbk, params, name){
        
//         const freeIdx = this.GetNextFree();
//         if(freeIdx !== INT_NULL){
            
//             const anim = this.animations[freeIdx]
//             anim.Create(animationClbk, stopAnimationClbk, params, this.count, name);
//             anim.in_animation = true; 
//             anim.is_active = true; 
//             this.count++;
//         }
//         else{alert('Not enough space for new Animation. At Animations.js:Animations.Create()')}
//         return freeIdx;
//     }


//     Run(){
//         if(this.count){
//             for(let i=0; i<this.size; i++){
//                 if(this.animations[i].is_active){
//                     if(this.animations[i].in_animation){
//                         this.animations[i].Run();
//                     }
//                     else{ // Here do stuf if animation stops
//                         this.animations[i].Stop();
//                         this.count--;
//                     }
//                 }
//             }
//         }
//     }
// }



// const _animations = New_generic_buffer();



// export function AnimationsGet(){ return _animations; }



// export function Animations_create(animationClbk, stopAnimationClbk, params, name){
        
//     const anim = new Animation(animationClbk, stopAnimationClbk, params, name);
//     const idx = _animations.Add(anim);
    
//     return idx;

// }



// export function Animations_run(){

//     if(_animations.active_count===0) return;

//     for(let i=0; i <= _animations.boundary; i++){

//         if(_animations.buffer[i].is_active){
//             if(_animations.buffer[i].in_animation){
//                 _animations.buffer.Run();
//             }
//             else{ // Here do stuf if animation stops
//                 _animations.buffer[i].Stop();
//                 this.count--;
//             }
//         }
//     }
// }