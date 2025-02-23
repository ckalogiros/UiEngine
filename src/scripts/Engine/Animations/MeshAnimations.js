"use strict";

import { Gl_batch_set_RGBA, Gl_batch_set_pos_xy } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { New_generic_buffer } from "../Core/Buffers.js";
import { Str_buffer_get_by_idx, Str_buffer_store } from "../Core/StringBuffer.js";


/**
 * // TODO: Either we capture a pointer to the mesh attribute(color), so we store the changes, or we need to update the meshes attribute
 */





const ANIM_DATA = {
    T: 0,
    STEP: 1,
    MIN: 2,
    MAX: 3,
};




function MeshAnimations_get_type_to_string(anim_type_flag){
    if(anim_type_flag & ANIMATIONS.TYPE.COLOR) return 'COLOR';
}

function MeshAnimations_get_value_size(anim_type_flag, anim_data_type){
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
        if(anim_data_type & ANIMATIONS.DATA.POS.ROT) return 8;
        if(anim_data_type & ANIMATIONS.DATA.POS.XY) return 2;
        if(anim_data_type & ANIMATIONS.DATA.POS.X) return 1;
        if(anim_data_type & ANIMATIONS.DATA.POS.Y) return 1;
    }
    alert('No apropriate size found for Animations value data size\nAnimations.js')
}

function MeshAnimations_get_value_offset(anim_type_flag, anim_data_type){

    let offsets = [];
    if(anim_type_flag & ANIMATIONS.TYPE.COLOR){

        if(anim_data_type & ANIMATIONS.DATA.COLOR.R) offsets.push(0);
        if(anim_data_type & ANIMATIONS.DATA.COLOR.G) offsets.push(1);
        if(anim_data_type & ANIMATIONS.DATA.COLOR.B) offsets.push(2);
        if(anim_data_type & ANIMATIONS.DATA.COLOR.A) offsets.push(3);
        return offsets;
    }
    else if(anim_type_flag & ANIMATIONS.TYPE.WPOS){
        
        if(anim_data_type & ANIMATIONS.DATA.POS.ROT)  offsets.push(0);
        if(anim_data_type & ANIMATIONS.DATA.POS.X)  offsets.push(0);
        if(anim_data_type & ANIMATIONS.DATA.POS.Y)  offsets.push(1);
        return offsets;
    }
}



function Choose_update_callback(anim_type_flag){
    if(anim_type_flag & ANIMATIONS.TYPE.COLOR) return Gl_batch_set_RGBA;
    if(anim_type_flag & ANIMATIONS.TYPE.WPOS) return Gl_batch_set_pos_xy;

}





class VB_DATA {

    constructor(vbidx, attribsidx, values_len){

        this.vbidx = vbidx;
        this.attribsidx = attribsidx;
        this.values_len = values_len;
        this.data = {
            starts: [],
            counts: null,
            which_vb: null,
            verts_per_rect: 0,
            values: [],
            values_indices: [],
            num_faces: [],
            offsets: [],
        };
        this.data_count = 0;
    }

    SetData(starts, values, num_faces, anim_type_flag, anim_data_type, which_vb, counts, verts_per_rect, start_val=0, has_start_value=false){
        if(values.constructor !== Float32Array && values.constructor !== Array) alert('values should be an array\nAnimations.js')
        

        this.data.starts.push(starts);
        this.data.num_faces.push(num_faces);
        this.data.counts = counts;
        this.data.which_vb = which_vb;
        this.data.verts_per_rect = verts_per_rect;
        
        
        this.data.offsets = MeshAnimations_get_value_offset(anim_type_flag, anim_data_type);
        for(let i=0; i < this.values_len; i++){
            
            if(!has_start_value) this.data.values[this.data_count] = values[i];
            else this.data.values[this.data_count] = start_val;
            this.data_count++;
        }
        
        
        // For now values_indices is 1 to 1 with the values
        this.data.values_indices.push((this.data_count/this.values_len)-1); // RGBA:4 values -> values_indices = 4/4-1=0idx, next 8/4-1=1idx, next 12/4-1=2idx, ... 
    }
}
class Animation_Data {

    constructor(){

        this.data = [];
    }

    SetData(t, step, min, max){
        this.data.push(t, step, min, max);
    }
}





class Mesh_Animation{

    constructor(anim_type_flag=0x0, anim_data_type){
        
        this.vb_data = []; 
        this.anim_data = [];
        this.UpdateClbk = null;
        this.is_active = false;
        this.in_animation = false;
        this.anim_type_flag = anim_type_flag;
        this.nameidx = Str_buffer_store(MeshAnimations_get_type_to_string(anim_type_flag));
    }

    SetVbData(vb_data){
        const idx = this.vb_data.push(vb_data)-1;
        return idx;
    }

    SetAnimData(anim_data){
        this.anim_data.push(anim_data);
    }


}






const _mesh_animations_mesh_refs_buffer = New_generic_buffer(_, 'Animations Mesh References Buffer');


const _mesh_animations_buffer = New_generic_buffer(_, 'Animations Buffer');


export function Mesh_animations_reset() { 

    _mesh_animations_buffer.ResetFull(); 
    ANIMATIONS.Reset();
}


export function Mesh_animations_get(){ return _mesh_animations_buffer; }


function Vb_data_exist(anim_type_idx, vbidx){
    
    if(_mesh_animations_buffer.buffer[anim_type_idx].vb_data === null) return INT_NULL;

    if(_mesh_animations_buffer.buffer[anim_type_idx].vb_data.vbidx === vbidx) return anim_type_idx;

    return INT_NULL;
}

function Analyze_flag(anim_type_flag, flag){

    if(anim_type_flag & ANIMATIONS.TYPE.COLOR){
        
        
        if(flag & ANIMATIONS.DATA.COLOR.RGBA) return (ANIMATIONS.DATA.COLOR.R|ANIMATIONS.DATA.COLOR.G|ANIMATIONS.DATA.COLOR.B|ANIMATIONS.DATA.COLOR.A);
        
        if(flag & ANIMATIONS.DATA.COLOR.RGB) return (ANIMATIONS.DATA.COLOR.R|ANIMATIONS.DATA.COLOR.G|ANIMATIONS.DATA.COLOR.B);
        if(flag & ANIMATIONS.DATA.COLOR.RGA) return (ANIMATIONS.DATA.COLOR.R|ANIMATIONS.DATA.COLOR.G|ANIMATIONS.DATA.COLOR.B);
        if(flag & ANIMATIONS.DATA.COLOR.RBA) return (ANIMATIONS.DATA.COLOR.R|ANIMATIONS.DATA.COLOR.G|ANIMATIONS.DATA.COLOR.B);
        if(flag & ANIMATIONS.DATA.COLOR.GBA) return (ANIMATIONS.DATA.COLOR.R|ANIMATIONS.DATA.COLOR.G|ANIMATIONS.DATA.COLOR.B);
        
        if(flag & ANIMATIONS.DATA.COLOR.BA) return (ANIMATIONS.DATA.COLOR.B|ANIMATIONS.DATA.COLOR.A);
        if(flag & ANIMATIONS.DATA.COLOR.GB) return (ANIMATIONS.DATA.COLOR.G|ANIMATIONS.DATA.COLOR.B);
        if(flag & ANIMATIONS.DATA.COLOR.GA) return (ANIMATIONS.DATA.COLOR.G|ANIMATIONS.DATA.COLOR.A);
        if(flag & ANIMATIONS.DATA.COLOR.RG) return (ANIMATIONS.DATA.COLOR.R|ANIMATIONS.DATA.COLOR.G);
        if(flag & ANIMATIONS.DATA.COLOR.RB) return (ANIMATIONS.DATA.COLOR.R|ANIMATIONS.DATA.COLOR.B);
        if(flag & ANIMATIONS.DATA.COLOR.RA) return (ANIMATIONS.DATA.COLOR.R|ANIMATIONS.DATA.COLOR.A);
        
        if(flag & ANIMATIONS.DATA.COLOR.R) return ANIMATIONS.DATA.COLOR.R;
        if(flag & ANIMATIONS.DATA.COLOR.G) return ANIMATIONS.DATA.COLOR.G;
        if(flag & ANIMATIONS.DATA.COLOR.B) return ANIMATIONS.DATA.COLOR.B;
        
        if(flag & ANIMATIONS.DATA.COLOR.A) return ANIMATIONS.DATA.COLOR.A;
    }
    else if(anim_type_flag & ANIMATIONS.TYPE.WPOS){
        // alert('IMPLEMENT FOR WPOS\nEEE\nAnimations.js')
        if(flag & ANIMATIONS.DATA.POS.ROT) return (ANIMATIONS.DATA.POS.ROT);
        if(flag & ANIMATIONS.DATA.POS.XY) return (ANIMATIONS.DATA.POS.X|ANIMATIONS.DATA.POS.Y);
        if(flag & ANIMATIONS.DATA.POS.X) return ANIMATIONS.DATA.POS.X;
        if(flag & ANIMATIONS.DATA.POS.Y) return ANIMATIONS.DATA.POS.Y;
    }
    alert('No apropriate size found for Animations value data size\nAnimations.js')
}


/**
 * 
 * @param {*} anim_type_flag    type of: "ANIMATIONS.TYPE."
 * @param {*} values_len_flag   type of: "ANIMATIONS.DATA."
 * @param {*} mesh 
 * @param {*} step      The step in wich the values will be transformed
 * @param {*} min       min time (in case of cyclical animation)
 * @param {*} max       max time
 * @param {*} start_t   Starting time
 * @param {*} start_v   The starting value
 * @param {*} has_start_value   We need a separate bool in order to set as the start value the 0
 */
export function Mesh_animations_create(anim_type_flag=0x0, values_len_flag=0x0, mesh=null, step=0, min=0, max=0, start_t=0, start_v=0, has_start_value=false){
        
    const vbidx = mesh.gfx.vb.groupidx;
    const starts = mesh.gfx.vb.starts.buffer;
    const counts = mesh.gfx.vb.counts.buffer;
    const which_vb = mesh.gfx.vb.which_vb;
    const verts_per_rect = (mesh.gfx.vb.counts.active_count > 1) ? 1 : VERTS_PER_RECT_INDEXED; // For instanced meshes that have per instance data, the number of times run must be 1 and not 4(per vertex)
    const attribsidx = mesh.gfx.prog.attribsidx;
    const num_faces = mesh.geom.num_faces;
    let values = [];
    
    
    const vals_len_flag = Analyze_flag(anim_type_flag, values_len_flag)
    console.log('values_len_flag', values_len_flag, '\nvals_len_flag', vals_len_flag)
    
    // Create animation type, if does not exist 
    let anim = null
    let anim_type_idx = INT_NULL;
    if(anim_type_flag & ANIMATIONS.TYPE.COLOR){
        
        if(ANIMATIONS.INDEX.COLOR !== INT_NULL){
            anim_type_idx = ANIMATIONS.INDEX.COLOR;
            anim = _mesh_animations_buffer.buffer[anim_type_idx];
        }
        else {
            
            anim = new Mesh_Animation(anim_type_flag);
            anim_type_idx = _mesh_animations_buffer.Add(anim);
            ANIMATIONS.INDEX.COLOR = anim_type_idx;
            
        }
        
        values = mesh.mat.col;
        
    }
    else if(anim_type_flag & ANIMATIONS.TYPE.WPOS){
        
        if(ANIMATIONS.INDEX.WPOS !== INT_NULL){
            anim_type_idx = ANIMATIONS.INDEX.WPOS;
            anim = _mesh_animations_buffer.buffer[anim_type_idx];
        }
        else {
            
            anim = new Mesh_Animation(anim_type_flag);
            anim_type_idx = _mesh_animations_buffer.Add(anim);
            ANIMATIONS.INDEX.WPOS = anim_type_idx;
        }
        
        // values = new Float32Array([
        //     mesh.geom.pos[0],
        //     mesh.geom.pos[1],
        // ]);
        values = mesh.geom.pos;
        // values = mesh.GetPosX();
        
        // Store a refference of the mesh so we can change the wpos or color of the mesh
        // _mesh_animations_mesh_refs_buffer.Add({
        //     mesh.geom.pos,
        // });
    }
    
    
    const vals_len = MeshAnimations_get_value_size(anim_type_flag, values_len_flag)
    
    
    const t = start_t ? start_t : min;
    const t_step = step;
    
    // Create vb data, if does't exist
    let vb_data_idx = Vb_data_exist(anim_type_idx, vbidx)
    if(vb_data_idx === INT_NULL){
        
        const vb_data = new VB_DATA(vbidx, attribsidx, vals_len);
        vb_data_idx = anim.SetVbData(vb_data);
        
        // vb and anim data supose to be 1 to 1 element count
        const anim_data = new Animation_Data();
        anim.SetAnimData(anim_data);
    }
    
    // Finally, after type and vb are set, create the animation data for the mesh
    anim.vb_data[vb_data_idx].SetData(starts, values, num_faces, anim_type_flag, vals_len_flag, which_vb, counts, verts_per_rect, start_v, has_start_value)
    anim.anim_data[vb_data_idx].SetData(t, t_step, min, max)
    
    // Set apropriate callback
    anim.UpdateClbk = Choose_update_callback(anim_type_flag)
    
    anim.is_active = true;
    anim.in_animation = true;
}



function Min_max(values, anim_data, flags, values_len){

    const min = anim_data[ANIM_DATA.MIN], max = anim_data[ANIM_DATA.MAX];

    let switcher = 1;

    for(let i=0; i < values_len; i++){

                
        if(flags & ANIMATIONS.TYPE.CYCLICAL){
            // continue in the oposite direction
            if(values[i] < min && anim_data[ANIM_DATA.STEP] < 0) {
                anim_data[ANIM_DATA.STEP] *= -1;
            }
            else if(values[i] > max && anim_data[ANIM_DATA.STEP] > 0) {
                anim_data[ANIM_DATA.STEP] *= -1;
            }
        }
        else{
            
            // Stop animation
            // If no Stop() callback is stored, just remove anim_data and values_data 
        }
        
        values[i] += anim_data[ANIM_DATA.STEP];

        
        // if(i===0)values[i] += Timer_get_global_timer_sine()*4;
        // else values[i] += Timer_get_global_timer_cosine()*4;

        // const speed = 8
        // if(switcher > 0)values[i] += Math.sin(Timer_get_global_timer()*speed)*speed;
        // else values[i] += Math.cos(Timer_get_global_timer()*speed)*speed;

    
        switcher *= -1;
    }
}


export function Mesh_animations_run(){

    if(_mesh_animations_buffer.active_count===0) return;

    for(let i=0; i <= _mesh_animations_buffer.boundary; i++){
        
        if(_mesh_animations_buffer.buffer[i].is_active){
            if(_mesh_animations_buffer.buffer[i].in_animation){
                
                const len = _mesh_animations_buffer.buffer[i].vb_data.length;
                for(let j=0; j < len; j++){
                    
                    const vb_data = _mesh_animations_buffer.buffer[i].vb_data[j];
                    const anim_data = _mesh_animations_buffer.buffer[i].anim_data[j].data;
                    Min_max(vb_data.data.values, anim_data, _mesh_animations_buffer.buffer[i].anim_type_flag, vb_data.values_len)
                    
                    _mesh_animations_buffer.buffer[i].UpdateClbk(vb_data.vbidx, vb_data.data.starts, vb_data.data.values, 
                                                     vb_data.data.values_indices, vb_data.values_len, vb_data.attribsidx, 
                                                     vb_data.data.num_faces, vb_data.data.offsets, vb_data.data.which_vb, vb_data.data.counts);
                                                    //  vb_data.data.num_faces, vb_data.data.offsets, vb_data.data.which_vb, vb_data.data.counts, vb_data.data.num_faces[0]);


                    // _mesh_animations_mesh_refs_buffer.buffer[i].geom.pos[0] += vb_data.data.values[0]
                }

                
                

            }
            else{ // Here do stuf if animation stops
                // _mesh_animations_buffer.buffer[i].is_active = false;
                // _mesh_animations_buffer.buffer[i].stopAnimationClbk(_mesh_animations_buffer.buffer[i].params);
                console.log("ANIMATIONS STOP")
            }
        }
    }
}


/**********************************************************************************************************************************/
// Debug-Print

export function Mesh_animations_print(){

    console.log('boundary', _mesh_animations_buffer.boundary, 'size', _mesh_animations_buffer.size)
    for(let i=0; i <= _mesh_animations_buffer.boundary; i++){
        console.log(
            'type:', MeshAnimations_get_type_to_string(_mesh_animations_buffer.buffer[i].anim_type_flag),
            '\nname:', Str_buffer_get_by_idx(_mesh_animations_buffer.buffer[i].nameidx),
            '\nattribsidx:', _mesh_animations_buffer.buffer[i].vb_data.attribsidx,
            '\nvb_data', _mesh_animations_buffer.buffer[i].vb_data,
            '\nanim_data', _mesh_animations_buffer.buffer[i].anim_data,
        );
    }
}

