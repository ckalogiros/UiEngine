"use strict";

import { Free_int8_buffer, M_Buffer, New_int8_buffer } from "../../Core/Buffers.js";

/**
 * IMPLEMENTATION:
 * Store indexes to 'children buffer' of a mesh, in order to reposition them according to some prerequisites.
 * Uppon position update, the parent mesh must be passed(as a refference), so that the stored indexes in 'rel_comp.buffer' 
 * can access the children meshes via the 'parent.children' buffer, and change any positions.
 * 
 * For now the rel_pos.buffer element is returned to any mesh as a refference, NOT as an index.
 */

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

      this.AddAtIndex(REL_POS.LEFT, New_int8_buffer(_, 'NEW RelativePosition LEFT'));
      this.AddAtIndex(REL_POS.RIGHT, New_int8_buffer(_, 'NEW RelativePosition RIGHT'));
   }

   Destroy(){

      for(let i=0; i < REL_POS.SIZE; i++){
         Free_int8_buffer(this.buffer[i]);
      }
      
   }
   
} 




export function Relative_pos_comp_create_new_comp(){
   return new RelativePosition();
}




export function Relative_pos_comp_add_child_to_comp(whereidx, parent, childidx){
   
   const comp = parent.rel_comp;
   const idx = comp.buffer[whereidx].Add(childidx);

   Rel_pos_fn_ptr[whereidx](whereidx, parent, childidx);
   
   return idx;

}




function Relative_pos_comp_align_child_left(whereidx, parent, childidx){

   const left_children = parent.rel_comp.buffer[whereidx];
   const new_elem = parent.children.buffer[childidx];

   let x = 0;


   // If the mesh its the first child in the left sequence of meshes, use the last mesh as the initial start pos
   if(left_children.boundary > 0){

      const lastidx = left_children.boundary-1;
      const last_elem = parent.children.buffer[lastidx];
      x = last_elem.geom.pos[0] + last_elem.geom.dim[0];
   }
   else{ // Else get the left position of the parent
      // const extra = (parent.margin) ? parent.StylesGetMargin(STYLES.AXIS.X) : (parent.pad) ? parent.pad : 0;
      const extra = new_elem.geom.dim[0] + parent.StylesGetMargin(STYLES.AXIS.X); 
      x = parent.geom.pos[0] - parent.geom.dim[0] + extra;
   }


   // Find the corect position
   x += new_elem.geom.dim[0];

   // Update children's position
   new_elem.TEMP_recalc_x(x); // Guarantees the recursive move of all it's children
   
}




function Relative_pos_comp_align_child_right(whereidx, parent, childidx){

   const children = parent.rel_comp.buffer[whereidx];
   const new_elem = parent.children.buffer[childidx];

   let x = 0;

   // If the mesh its the first child is left in the sequence of meshes(buffer), use the last mesh as the initial start pos
   if(children.boundary > 0){

      const lastidx = children.boundary-1;
      const last_elem = parent.children.buffer[lastidx];
      x = last_elem.geom.pos[0];
   }
   else{ // Else its the first 'right' mesh, so get the right position of the parent as the initial start position
      const extra = new_elem.geom.dim[0]*2 - parent.StylesGetMargin(STYLES.AXIS.X); 
      x = parent.geom.pos[0] + parent.geom.dim[0]*2 - extra;
   }

   // Find the corect position
   x -= new_elem.geom.dim[0];

   // Update children's position
   new_elem.TEMP_recalc_x(x); // Guarantees the recursive move of all it's children

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
   let x = parent.geom.pos[0];

   for(let i=0; i <= children.boundary; i++){
      
      const elemidx = children.buffer[i];
      const elem = parent.children.buffer[elemidx];

      console.log('1111111111111111111111', elem.GetName())

      if(elem.state.mask & MESH_STATE.ACTIVE){
         x += elem.geom.dim[0]*2;
         elem.TEMP_recalc_x(x);
         x += elem.geom.dim[0];
      }

   }
}




function _Relative_pos_comp_recalc_right(whereidx, parent){

   const children = parent.rel_comp.buffer[whereidx];
   let x = parent.geom.pos[0] + parent.geom.dim[0]*2;

   for(let i=0; i <= children.boundary; i++){
      
      const elemidx = children.buffer[i];
      const elem = parent.children.buffer[elemidx];

      const pad = elem.StylesGetPad(STYLES.AXIS.X)

      x -= elem.geom.dim[0]*2;
      elem.TEMP_recalc_x(x);
   }
}










/**************************************************************************************************************/
// Move specific buffer: For resize we do not need to recalculate the positions, just move the meshes




/** Move all meshes that belong to the buffer of the 'right' relative positioning */
export function Relative_pos_comp_move_right_buffer(whereidx, parent, x){
   
   const children = parent.rel_comp.buffer[whereidx];

   for(let i=0; i <= children.boundary; i++){
      
      const elemidx = children.buffer[i];
      const elem = parent.children.buffer[elemidx];

      
      // console.log(elem.GetName())

      // If elem is a synthesized mesh (widget), move elem and all its children
      elem.MoveXNoGfxUpdate(x)
      // elem.SetPosXNoGfxUpdate(x*2)
   }
}