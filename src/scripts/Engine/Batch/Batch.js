"use strict";

import { Gl_batch_update_fn_byidx } from "../../Graphics/Buffers/VertexBufferOpsBatch.js";
import { Shader_attributes_get_attrib_offset_by_nameid, Shader_attributes_get_attribs_per_vertex } from "../../Graphics/ShaderAttributes.js";
import { Program_get_shader_attributes_index } from "../../Graphics/ShaderPrograms.js";


/**
 * For new vb_index_buffer: we calc vb_index[progs_cnt + k]
 * 
 * // TODO: Explain about different vbs for each prog buffer and vb_index[progs_cnt + k] 
 * 
 * // TODO: Implement auto prog buffer creation from Gl_program create. Maybe the same for vbs.
 * Also the vb_index buffer length should be calculated by: accum vbs of each program 
 * 
 * // TODO: For meshes that update twice in a frame, use the 'mesh.batchidx' to increment the pos value instead of register to new buffer element 
 * 
 * // TODO: Implement an algorithm to combine all meshes of the same vertex buffer into one element and one call from batch_update
 * See if the call to 'Batch_store()' can be in a less start index order from a widget that moves a lot of children with same class type
 * 
 */


/**************************************************************** */
/**
 * Batch buffer is stuctured as such:
 * _batch[i1][i2][i3]
 * [i1]: An array of GFX shader programs, pre-alocated.
 * [i2]: An array of GFX vertex buffers, created uppon batch buffer construction
 * [i3]: An array of mesh data
 * The first three buffers are storing indexes to the equivalent gfx buffers.
 * It's purpose is to store mesh data by the mesh's gfx vertex buffer.
 * That way we can optimize mesh data in the graphics buffers.
 */
const _batch = [];





/**
 * Reason of progs_index: Avoid "if" statements for batch buffer struct. 
 * In order to add arbitrarily gfx programs to batch storage, we need 
 * an index buffer so that:
 * When a mesh comes (as param), and lets say it has 'gfx.prog.idx=2', 
 * instead of storing the mesh's data to batch program's buffer of index 2,
 * we store the program index(2) to the  'progs_index' buffer at index 0.
 * So the 'progs_index' would look like: 'progs_index = [2, INT_NULL, INT_NULL, INT_NULL, INT_NULL]'.
 * Now when we access the batch's programs buffer, we do it via the 'progs_index', using the mesh's
 * gfx.prog.idx as an index to the buffer.
 * E.x. _batch[ *progs_index[mesh.gfx.prog.idx]* ].
 * That way we can store arbitrarily any index value in order without wasting batch programs buffers.
 * E.x. Assuming the batch is gonna update meshes from only one program, lets say program index 2.
 * With the implementation we can store all of the meshes data (of program index 2) to the 0th batch programs buffer,
 * and not wasting the first 2 batch programs buffers 0 and 1.
 * Also when we will run the batch update we will run only active buffers and not
 * have to use an if statment to check if the batch programs buffer has any meshes to update
 * 
 * 
 * // IMPORTANT: MAX PROGRAMS we assume the max gl programs are 5. 
 * // TODO: Implement a function to decide or better change the max programs dynamicaly, so we do not have to change manually the max programs here.
 */
let progs_index = [INT_NULL, INT_NULL, INT_NULL, INT_NULL, INT_NULL];

// TODO: Initialize any programs from the gl program creation function.
{
   // PRE-INITIALIZATION for efficiency
   _batch[0] = []; _batch[1] = []; _batch[2] = []; _batch[3] = []; _batch[4] = []; 

}

let progs_cnt = 0;
let prog_cnt = 0;

let vb_index = new Int8Array(32);
for(let i=0; i<vb_index.length; i++){
   vb_index[i] = INT_NULL
}
   
let vb_cnt = new Int8Array(5); // One for each program
vb_cnt[0] = 0; vb_cnt[1] = 0; vb_cnt[2] = 0; vb_cnt[3] = 0; vb_cnt[4] = 0; let any_update = false;




export function Batch_store(mesh, first_attrib_offset, update_data=null, num_faces=0, start=INT_NULL) {

   TEMP_TEST_PERFORMANE_COUNTERS.MESH_INFO_UI.BATCH_STORE++;
   // _pt_batch_update.timer.Start();

   if (mesh.gfx) {

      const j = mesh.gfx.prog.idx;

      if (progs_index[j] === INT_NULL) {
         progs_index[j] = prog_cnt;
         prog_cnt++;
      }
      if (_batch[progs_index[j]][vb_index[prog_cnt-1+j]] === _) {
         if (vb_index[prog_cnt-1+j] === INT_NULL) {
            vb_index[prog_cnt-1+j] = vb_cnt[prog_cnt-1];
            vb_cnt[prog_cnt-1]++;
         }
         _batch[progs_index[j]][vb_index[prog_cnt-1+j]] = [];
      }

      const data = {
         fnidx : mesh.batch_fnidx,
         progidx : mesh.gfx.prog.idx, 
         vbidx : mesh.gfx.vb.idx,
         start : (start!==INT_NULL) ? start : mesh.gfx.vb.start, 
         vertsPerRect : mesh.gfx.vertsPerRect, 
         num_faces : (num_faces) ? num_faces : mesh.geom.num_faces, 
         update_data:update_data,
         first_attrib_offset:first_attrib_offset,
         /**DEBUG*/name: mesh.GetName(),
      }

      // TODO: If same mesh, use the mesh.batchidx to store changes

      // The 'batchidx' will tell, if the mesh has already been registered for update.
      mesh.batchidx = _batch[progs_index[j]][vb_index[prog_cnt-1+j]].push(data);
      any_update = true;
      mesh.batch_fnidx = INT_NULL;
   }

   // _pt_batch_update.timer.Stop();
}


export function Batch_cancel_batch_byidx(batchidx){

}



export function Batch_update() {
   
   if(!any_update) return;

   // _pt_batch_update.timer.Start();
   // console.log('------------------------------------------------')
   // console.log(_batch);

   const i2len = _batch.length;
   for (let i2 = 0; i2 < i2len; i2++) { // Program

      
      const i3len = _batch[i2].length;
      for (let i3 = 0; i3 < i3len; i3++) { // Vertex Buffer
         
         const i4len = _batch[i2][i3].length;
         for (let i4 = 0; i4 < i4len; i4++) {
            
            const data = _batch[i2][i3][i4];
            
            // EFFICIENCY: We can get the attribsidx only every program, yet we get it for each vertex buffer and for each mesh
            const attribsidx = Program_get_shader_attributes_index(data.progidx);
            const attribs_per_vertex = Shader_attributes_get_attribs_per_vertex(attribsidx);
            
            const attrib_offset = Shader_attributes_get_attrib_offset_by_nameid(attribsidx, data.first_attrib_offset);
            //                        fnidx,     vbidx,     start,      attrib_offset,    verts_per_rect, attribs_per_vertex, num_faces = 1,    mat,      geom,   update_data
            Gl_batch_update_fn_byidx(data.fnidx, data.vbidx, data.start, attrib_offset, data.vertsPerRect, attribs_per_vertex, data.num_faces, data.update_data);

            // console.log(data.name, data);
         }
      }
   }

   // TODO: What if we reset in the for loop???
   {// Clear buffers for next use
      _batch[0] = []; // Reset the programs buffer, for which we have pre-alocated and initialized
      _batch[1] = []; // Reset the programs buffer, for which we have pre-alocated and initialized
      _batch[2] = []; // Reset the programs buffer, for which we have pre-alocated and initialized
      _batch[3] = []; // Reset the programs buffer, for which we have pre-alocated and initialized
      _batch[4] = []; // Reset the programs buffer, for which we have pre-alocated and initialized

      // progs_cnt = 0; // Reset the batch programs counter for the next batch costruction.
      prog_cnt = 0; 

      // We must reset the progs_index, because we check for INT_NULL on every call.
      progs_index = [INT_NULL, INT_NULL, INT_NULL, INT_NULL, INT_NULL];

      vb_cnt[0] = 0;
      vb_cnt[1] = 0;
      vb_cnt[2] = 0;
      vb_cnt[3] = 0;
      vb_cnt[4] = 0;
      for(let i=0; i<vb_index.length; i++){
         vb_index[i] = INT_NULL
      }
      
      any_update = false;
   }

   // _pt_batch_update.timer.Stop();
   TEMP_TEST_PERFORMANE_COUNTERS.MESH_INFO_UI.BATCH_UPDATE++;
}
