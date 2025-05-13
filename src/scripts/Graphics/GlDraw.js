import { Texture_get_texture_unit_byidx } from '../Engine/Loaders/Textures/Texture.js';
import { Renderqueue_get_active, Renderqueue_active_get_count } from '../Engine/Renderers/Renderer/RenderQueue.js';
import { Gl_texture_unit_bind } from './GlTextureUnit.js';
import { Index_buffer_get_by_ibidx, Index_buffer_info_get_by_ibidx } from './Buffers/IndexBuffers.js';
import { VBI_get_byidx, VBI_get_vbo, Vertex_buffer_get_by_vbidx, Vertex_buffer_group_get_byidx, Vertex_buffer_set_and_update_uniforms_no_vao_binding } from './Buffers/VertexBuffers.js';
import { Program_get_programs } from './ShaderPrograms.js';
import { Vertex_buffer_render_group_get_render_group } from './Buffers/RenderGroups.js';






// rgb(38, 27, 37)
const R = .0;
const G = .0;
const B = .0;


let TEST = 0
export function Gl_draw(gl) {

    // Renderer_webgl_begin_timer_query(gfxCtx);


    const drawQueue = Renderqueue_get_active();
    const drawQueueCount = Renderqueue_active_get_count();

    // console.log(Hash(Timer_get_global_timer_cycle()).toFixed(1))

    gl.clearColor(R, G, B, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    let progidx = INT_NULL;
    let progs = Program_get_programs();

    for (let i = 0; i < drawQueueCount; i++) {

        progidx = drawQueue[i].progidx;
        const vb_groupidx = drawQueue[i].vb_groupidx;
        const ibidx = drawQueue[i].ibidx;


        if (GL_STATE.BOUND_PROG_IDX !== progidx) {
            gfxCtx.gl.useProgram(progs.buffer[progidx].shader_program);
            GL_STATE.BOUND_PROG_IDX = progidx;
            GL_STATE.BOUND_PROG = progs.buffer[progidx].shader_program;
        }



        const vb_group = Vertex_buffer_group_get_byidx(vb_groupidx);
        const ib_info = Index_buffer_info_get_by_ibidx(ibidx);

        if (GL_STATE.BOUND_VAO !== vb_group.vao) {
            gl.bindVertexArray(vb_group.vao);
            GL_STATE.BOUND_VAO = vb_group.vao;
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib_info.ibo);
        if (ib_info.state.mask & BUFFER_STATE.NEEDS_UPDATE || GL_STATE.BOUND_IBO !== ib_info.ibo) {
            const ib_data = Index_buffer_get_by_ibidx(ib_info.ibidx);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ib_data, gl.STATIC_DRAW, 0);
            ib_info.state.mask &= ~BUFFER_STATE.NEEDS_UPDATE;
            GL_STATE.BOUND_IBO = ib_info.ibo;
            GL_STATE.BOUND_IBIDX = ib_info.ibidx;
        }

        for (let j = 0; j <= vb_group.render_groupidxs.boundary; j++) {

            const render_group = Vertex_buffer_render_group_get_render_group(vb_group.render_groupidxs.buffer[j]);

            // TODO: Distinguish uniforms that will update with uniforms with constant value
            Vertex_buffer_set_and_update_uniforms_no_vao_binding(vb_groupidx, progidx); // OLD: Update via Vertex buffer

            if (vb_group.has_scissorbox) {
                gl.enable(gl.SCISSOR_TEST);
                gl.scissor(vb_group.scissorbox[0], vb_group.scissorbox[1], vb_group.scissorbox[2], vb_group.scissorbox[3]);
            }

            // if (GL_STATE.BOUND_TEXTURE_IDX !== vb_group.texidx && progs.buffer[progidx].sid.attr & SID.ATTR.TEX2 && vb_group.texidx !== INT_NULL ) {
            if (GL_STATE.BOUND_TEXTURE_IDX !== vb_group.texidx && vb_group.texidx !== INT_NULL) {
                const texture = Texture_get_texture_unit_byidx(vb_group.texidx);
                Gl_texture_unit_bind(gl, texture);
                gl.uniform1i(progs.buffer[progidx].shaderinfo.uniforms.sampler, texture.texidx);
            }

            if(render_group.state & RENDER_GROUP_STATE.NEEDS_UPDATE) {

                const vbo = VBI_get_vbo(render_group.vb_data_idx);
                gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
                const vb_data = Vertex_buffer_get_by_vbidx(render_group.vb_data_idx);
                gl.bufferSubData(gl.ARRAY_BUFFER, render_group.start*FLOAT32_BYTE_SIZE, vb_data, render_group.start, render_group.count);

                
                render_group.state &= ~RENDER_GROUP_STATE.NEEDS_UPDATE;
                GL_STATE.BOUND_VBO = vbo;
                GL_STATE.BOUND_VBIDX = render_group.vb_data_idx;

                console.log(
                    'vb_idx', render_group.vb_data_idx,
                    'rg_idx', vb_group.render_groupidxs.buffer[j],
                    'start', render_group.start,
                    'coun', render_group.count
                    // render_group.
                    // render_group.
                )
            }

           
            
            /** The last param is the instance count.
             * That means: draw that many instances ONLY from the vertex buffer of the instanced geometry,
             * If instance count is 1, draw the first instanced geometry attributes. 
             * If instance count is 2, draw the first instanced geometry attributes for the first instance and the second for the second. etc
             * So in order to use more than one meshe's attributes from any instanced buffer, the instance count is responsible 
            */

            const index_elements_offset = 6*j;
            const instance_count = 1;

            // gl.LINES, gl.POINTS, gl.TRIANGLES
            gl.drawElementsInstanced(gl.TRIANGLES, render_group.draw_count, gl.UNSIGNED_SHORT, render_group.index_offset*UINT16_BYTE_SIZE, instance_count)
            // gl.drawElementsInstanced(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0, instance_count)
            // gl.drawElementsInstanced(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 6, instance_count)

            if (vb_group.has_scissorbox) gl.disable(gl.SCISSOR_TEST);

        }

    }

    // Renderer_webgl_end_timer_query(gfxCtx);
}








// Pass an array[] as 'gfx_queue' from which to draw gfx buffers. 'gfx_queue' must be of struct: [{groupidx, progidx, vbidx}, ...]
export function Gl_draw_specific(gl, gfx_queue, w, h) {

    // const gfx_group = Progarm_get_program();
    // const count = gfx_queue.length;

    // gl.viewport(0, 0, VIEWPORT.WIDTH, VIEWPORT.HEIGHT);
    // gl.enable(gl.DEPTH_TEST);
    // gl.depthMask(false);
    // const transparent = .111
    // gl.clearColor(transparent, transparent, transparent, 1.); // Black controls the transparency of the framebuffer texture.
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    // for (let i = 0; i < count; i++) {

    //     const groupidx = gfx_queue[i].groupidx;
    //     const progidx = gfx_queue[i].progidx;
    //     const vbidx = gfx_queue[i].vbidx;

    //     const progs = gfx_group.buffer[groupidx];

    //     if (GL_STATE.BOUND_PROG_IDX !== progidx)
    //         Program_use_program(progs.buffer[progidx].shader_program, progidx)

    //     // Update all program uniforms
    //     progs.buffer[progidx].UniformsUpdate(gl);

    //     const vb = progs.buffer[progidx].vb[vbidx];
    //     const ib = Gl_ib_get_byidx(progs.buffer[progidx].ib[vbidx]);

    //     if (GL_STATE.BOUND_VAO !== ib.vao)
    //         GlBindVAO(ib.vao)


    //     if (progs.buffer[progidx].sid.attr & SID.ATTR.TEX2) {
    //         if (vb.texidx !== INT_NULL) {
    //             const texture = Texture_get_texture_unit_byidx(vb.texidx);
    //             Gl_texture_unit_bind(gl, texture);
    //             gl.uniform1i(progs.buffer[progidx].shaderinfo.uniforms.sampler, texture.texidx);
    //         }
    //     }

    //     if (ib.needs_update)
    //         Index_buffer_set_ib_data(gl, ib)
    //     if ((vb.state.mask |= BUFFER_STATE.NEEDS_UPDATE)===0)
    //         Vertex_buffer_set_vb_data(gl, vb);

    //     gl.drawElements(gl.TRIANGLES, ib.count, gl.UNSIGNED_SHORT, 0);






    /** Scroller test: Draws only the scrolled_mesh meshes */
    // gl.drawElements(gl.TRIANGLES, ib.count, gl.UNSIGNED_SHORT, 36);

    /** Example of multidraw meshes in a vertex buffer
     * For OpenGl: https://www.khronos.org/opengl/wiki/Vertex_Rendering#Multi-Draw
     * For webGl: https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_multi_draw
     Multi-Draw
     The basic drawing functions are all you really need in order to send vertices for rendering. However, there are a number of ways to draw that optimize certain rendering cases.
     Rendering with a different VAO from the last drawing command is usually a relatively expensive operation. So many of the optimization mechanisms are based on you storing the data for several meshes in the same buffer objects with the same vertex formats and other VAO data.
     Binding a VAO or modifying VAO state is often an expensive operation. And there are many cases where you want to render a number of distinct meshes with a single draw call. All of the meshes must be in the same VAO (and therefore the same buffer objects and index buffers). Also, of course, they must use the same shader program with the same uniform values.
     To render multiple primitives from a VAO at once, use this:
 
     void glMultiDrawArrays( GLenum mode​, GLint *first​, GLsizei *count​, GLsizei primcount​);
 
     This function is conceptually implemented as:
 
     void glMultiDrawArrays( GLenum mode, GLint *first, GLsizei *count, GLsizei primcount )
     {
         for (int i = 0; i < primcount; i++)
         {
             if (count[i] > 0)
                 glDrawArrays(mode, first[i], count[i]);
         }
     }

     So we would need a buffer of starts[] and counts[]

     */


    // }

    // gl.viewport(0, 0, VIEWPORT.WIDTH, VIEWPORT.HEIGHT);
    // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // // gl.bindTexture(gl.TEXTURE_2D, null);
    // gl.disable(gl.DEPTH_TEST);
    // // gl.depthMask(true);

}










/********************************************************************/
// OLD

// Update vertex buffer data
// // IMPORTANT: HERE!: Why check every frame and not update the vb AND ib at the location of the buffer data update??????
// if (vb_group.needs_any_update) {
//     for (let j = 0; j <= vb_group.vb_idxs.boundary; j++) {

//         const vb_info = VBI_get_byidx(vb_group.vb_idxs.buffer[j]);
//         if (vb_info.state.mask & BUFFER_STATE.NEEDS_UPDATE) {

//             const vb_data = Vertex_buffer_get_by_vbidx(vb_info.vbidx);
//             gl.bindBuffer(gl.ARRAY_BUFFER, vb_info.vbo)
//             gl.bufferData(gl.ARRAY_BUFFER, vb_data, gl.DYNAMIC_DRAW);
//             if (vb_info.state.mask & BUFFER_STATE.NEEDS_UPDATE_FROM_REALLOC) { 
//                 gl.bufferData(gl.ARRAY_BUFFER, vb_data, gl.DYNAMIC_DRAW); 
//                 vb_info.state.mask &= ~BUFFER_STATE.NEEDS_UPDATE_FROM_REALLOC;
//             }
//             else {
                
//                 // gl.bufferSubData(gl.ARRAY_BUFFER, dst_offset:IN_BYTES, buffer.data, src_offset:IN_ELEMENTS, byte_length:IN_ELEMENTS);
//                 gl.bufferSubData(gl.ARRAY_BUFFER, render_group.start, vb_data, render_group.start, render_group.count);

//                 /**MAPPING DIRECTLY TO GPU MEMORY
//                  * 
//                  * Create a pointer to the gpu memory. 
//                  * // 2. Map buffer to CPU memory
//                      const ptr = gl.mapBufferRange(
//                         gl.ARRAY_BUFFER,
//                         0,                // byte offset
//                         1024,             // byte length
//                         gl.MAP_WRITE_BIT
//                     );

//                     // Then on update Draw(), just ch
//                     // 3. Directly modify via typed array view
//                     const view = new Float32Array(ptr);
//                     view.set([1,2,3], 0); // Write at element offset 0

//                     // 4. Unmap to sync changes
//                     gl.unmapBuffer(gl.ARRAY_BUFFER);
//                 */
//             }

//             vb_info.state.mask &= ~BUFFER_STATE.NEEDS_UPDATE;
//             GL_STATE.BOUND_VBO = vb_info.vbo;
//             GL_STATE.BOUND_VBIDX = vb_info.vbidx;

//         }
//     }
//     vb_group.needs_any_update = false;
// }