import { Texture_get_texture_byidx } from '../Engine/Loaders/Textures/Texture.js';
import { Renderqueue_get_active, Renderqueue_active_get_count } from '../Engine/Renderers/Renderer/RenderQueue.js';
import { Gl_texture_unit_bind } from './GlTextureUnit.js';
import { Index_buffer_get_by_ibidx, Index_buffer_info_get_by_ibidx } from './Buffers/IndexBuffers.js';
import { Vertex_buffer_get_by_vbidx, Vertex_buffer_info_get_by_vbidx } from './Buffers/VertexBuffers.js';
import { Program_get_programs } from './ShaderPrograms.js';



let temp_change = false;

export function Gl_draw(gl) {

    // const gfx_group = Program_get_groups();
    const drawQueue = Renderqueue_get_active();
    const drawQueueCount = Renderqueue_active_get_count();
    
    gl.clearColor(0.18, 0.18, 0.18, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(temp_change){

        // UBO_change_val();
        // Uniforms_block_update_uniform();
        temp_change = false;
    }


    for (let i = 0; i < drawQueueCount; i++) {
        
        // _pt_test_misc_1.timer.Start();
        const progidx = drawQueue[i].progidx;
        const vbidx = drawQueue[i].vbidx;
        const ibidx = drawQueue[i].ibidx;
        
        const progs = Program_get_programs();
        
        if (GL.BOUND_PROG_IDX !== progidx){
            gfxCtx.gl.useProgram(progs.buffer[progidx].shader_program);
            GL.BOUND_PROG_IDX = progidx;
            GL.BOUND_PROG = progs.buffer[progidx].shader_program;
        }
        
        // // Update all program uniforms
        // if(progs.buffer[progidx].state.mask & PROGRAM_STATE.UNIFORMS_NEED_UPDATE)
        //     progs.buffer[progidx].UniformsUpdate(gl);
        
        const vb_info = Vertex_buffer_info_get_by_vbidx(vbidx);
        const ib_info = Index_buffer_info_get_by_ibidx(ibidx);
        
        if (GL.BOUND_VAO !== vb_info.vao){
            gl.bindVertexArray(vb_info.vao)
        }
        if (GL.BOUND_TEXTURE_IDX !== vb_info.texidx && progs.buffer[progidx].sid.attr & SID.ATTR.TEX2 && vb_info.texidx !== INT_NULL ) {
            const texture = Texture_get_texture_byidx(vb_info.texidx);
            Gl_texture_unit_bind(gl, texture);
            gl.uniform1i(progs.buffer[progidx].shaderinfo.uniforms.sampler, texture.texidx);
        }
        // _pt_test_misc_1.timer.Stop();
        
        
        const vb = Vertex_buffer_get_by_vbidx(vb_info.vbidx);
        if (vb_info.state.mask & BUFFER_STATE.NEEDS_UPDATE) {
            
            gl.bindBuffer(gl.ARRAY_BUFFER, vb_info.vbo)
            gl.bufferData(gl.ARRAY_BUFFER, vb, gl.STATIC_DRAW, 0);
            vb_info.state.mask &= ~BUFFER_STATE.NEEDS_UPDATE;
            GL.BOUND_VBO = vb_info.ibo;
            GL.BOUND_VBIDX = vb_info.ibidx;
        }
        
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib_info.ibo);
        if (ib_info.state.mask & BUFFER_STATE.NEEDS_UPDATE) 
        {
            const ib = Index_buffer_get_by_ibidx(ib_info.ibidx);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ib, gl.STATIC_DRAW, 0);
            ib_info.state.mask &= ~BUFFER_STATE.NEEDS_UPDATE;
            GL.BOUND_IBO = ib_info.ibo;
            GL.BOUND_IBIDX = ib_info.ibidx;
        }
        
        
        gl.drawElements(gl.TRIANGLES, vb_info.draw_count, gl.UNSIGNED_SHORT, 0);

    }

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

    //     if (GL.BOUND_PROG_IDX !== progidx)
    //         Program_use_program(progs.buffer[progidx].shader_program, progidx)

    //     // Update all program uniforms
    //     progs.buffer[progidx].UniformsUpdate(gl);

    //     const vb = progs.buffer[progidx].vb[vbidx];
    //     const ib = Gl_ib_get_byidx(progs.buffer[progidx].ib[vbidx]);

    //     if (GL.BOUND_VAO !== ib.vao)
    //         GlBindVAO(ib.vao)


    //     if (progs.buffer[progidx].sid.attr & SID.ATTR.TEX2) {
    //         if (vb.texidx !== INT_NULL) {
    //             const texture = Texture_get_texture_byidx(vb.texidx);
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
