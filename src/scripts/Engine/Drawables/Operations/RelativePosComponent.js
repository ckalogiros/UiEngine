"use strict";

import { Int8Buffer, M_Buffer } from "../../Core/Buffers.js";



_CNT = 0;
export const REL_POS = {
   LEFT: _CNT++,
   RIGHT: _CNT++,
   SIZE: _CNT,
}




const Rel_pos_fn_ptr = [
   Relative_pos_comp_align_child_left,
   Relative_pos_comp_align_child_right,
];




class RelativePosition extends M_Buffer {

   constructor(){

      super();

      this.AddAtIndex(REL_POS.LEFT, new Int8Buffer());
      this.AddAtIndex(REL_POS.RIGHT, new Int8Buffer());
   }
   
} 




export function Relative_pos_comp_create_new_comp(){
   return new RelativePosition();
}




export function Relative_pos_comp_add_child_to_comp(whereidx, parent, childidx){
   
   const comp = parent.rel_comp;
   const idx = comp.buffer[whereidx].Add(childidx);
   
   Rel_pos_fn_ptr[whereidx](whereidx, parent, idx);
   
   return idx;

}




function Relative_pos_comp_align_child_left(whereidx, parent, childidx){

   const left_children = parent.rel_comp.buffer[whereidx];
   const new_elem = parent.children.buffer[childidx];

   let xpos = 0;


   // If the mesh its the first child in the left sequence of meshes, use the last mesh as the initial start pos
   if(left_children.boundary > 0){

      const lastidx = left_children.boundary-1;
      const last_elem = parent.children.buffer[lastidx];
      xpos = last_elem.geom.pos[0] + last_elem.geom.dim[0];
   }
   else{ // Else get the left position of the parent
      const extra = (parent.margin) ? parent.margin[0] : (parent.pad) ? parent.pad : 0;
      xpos = parent.geom.pos[0] - parent.geom.dim[0] + extra;
   }


   // Find the corect position
   xpos += new_elem.geom.dim[0];

   // Update children's position
   parent.children.buffer[childidx].SetPosXNoGfxUpdate(xpos); // Guarantees the recursive move of all it's children
   
}




function Relative_pos_comp_align_child_right(whereidx, parent, childidx){

   const children = parent.rel_comp.buffer[whereidx];
   const new_elem = parent.children.buffer[childidx];

   let xpos = 0;

   
   // If the mesh its the first child in the left sequence of meshes, use the last mesh as the initial start pos
   if(children.boundary > 0){

      const lastidx = children.boundary-1;
      const last_elem = parent.children.buffer[lastidx];
      xpos = last_elem.geom.pos[0] - last_elem.geom.dim[0];
   }
   else{ // Else get the right position of the parent as the initial start position
      const extra = (parent.margin) ? parent.margin[0] : (parent.pad) ? parent.pad : 0; 
      xpos = parent.geom.pos[0] + parent.geom.dim[0] - extra;
   }

   // Find the corect position
   xpos -= new_elem.geom.dim[0];

   // Update children's position
   parent.children.buffer[childidx].SetPosXNoGfxUpdate(xpos); // Guarantees the recursive move of all it's children

}





export function Relative_pos_comp_recalc_all(parent){
   
   _Relative_pos_comp_recalc_left(REL_POS.LEFT, parent);
   _Relative_pos_comp_recalc_right(REL_POS.RIGHT, parent);

}




export function Relative_pos_comp_recalc_left(parent){
   
   _Relative_pos_comp_recalc_left(REL_POS.LEFT, parent);
}




export function Relative_pos_comp_recalc_right(parent){
   
   _Relative_pos_comp_recalc_right(REL_POS.RIGHT, parent);
}



function _Relative_pos_comp_recalc_left(whereidx, parent){

   const children = parent.rel_comp.buffer[whereidx];
   const marginx = (parent.margin) ? parent.margin[0] : 0;
   let xpos = parent.geom.pos[0] - parent.geom.dim[0] + marginx;

   for(let i=0; i <= children.boundary; i++){
      
      const elemidx = children.buffer[i];
      const elem = parent.children.buffer[elemidx];

      xpos += elem.geom.dim[0];

      elem.SetPosXNoGfxUpdate(xpos);

      xpos += elem.geom.dim[0];
   }
}




function _Relative_pos_comp_recalc_right(whereidx, parent){

   const children = parent.rel_comp.buffer[whereidx];
   const marginx = (parent.margin) ? parent.margin[0] : 0;
   let xpos = parent.geom.pos[0] + parent.geom.dim[0] - marginx;

   for(let i=0; i <= children.boundary; i++){
      
      const elemidx = children.buffer[i];
      const elem = parent.children.buffer[elemidx];

      xpos -= elem.geom.dim[0];

      elem.SetPosXNoGfxUpdate(xpos);

      xpos -= elem.geom.dim[0];
   }
}