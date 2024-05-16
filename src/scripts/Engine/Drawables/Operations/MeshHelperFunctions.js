"use strict";



export function Mesh_set_uniform_ubidx_from_name(uniforms, ubidx, unif_name) {

   const len = uniforms.length;
   for (let i = 0; i < len; i++) {
       if (uniforms[i].name === unif_name) {
           uniforms[i].ubidx = ubidx;
           return;
       }
   }

   alert('Mesh_set_uniform_ubidx_from_name()\nNo mesh with uniform found.')
}



export function Mesh_get_uniform_ubidx_from_name(uniforms, unif_name) {

   const len = uniforms.length;
   for (let i = 0; i < len; i++) {
       if (uniforms[i].name === unif_name) {
           return uniforms[i].ubidx;
       }
   }

   alert('Mesh_get_uniform_ubidx_from_name()\nNo mesh with uniform found.')
}

