import { Textured_Mesh } from "./Textured_Mesh.js";
import { Renderqueue_set_priority_by_program } from "../../Renderers/Renderer/RenderQueue.js";
import { Framebuffer_get } from "../../../Graphics/Buffers/FrameBuffers.js";




export function Create_mesh_for_framebuffer(mesh, fb, pos, dim) {

   const rect = new Textured_Mesh(pos, [dim[0], dim[1]], [1.0, 1., 1.0, 1.], fb.texture.texture_file_id, 'Framebuffer 0');
   // rect.sid.shad |= SID.SHAD.PRE_MULTIPLIED_ALPHA; // Enable premultiply alpha

   { // Test for scrolled section resize
      // dim[1] /= 4;
      // rect.mat.uv[2] = .525;
      // rect.mat.uv[3] = 0.275;
   }

   rect.mat.uv[2] = 1;
   rect.mat.uv[3] = 0;

   /**
    * What we must do is to completely remove the scrolled mesh and just move the texture coordinates 
    * for scrolling the fb
    */

   rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   // rect.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   rect.ConstructListeners();

   rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   rect.Render();

   // Draw the framebuffer texture mesh first, and every other mesh on top.
   // Renderqueue_set_priority_by_program(FIRST, rect.gfx.prog.idx, rect.gfx.vb.groupidx);
   Renderqueue_set_priority_by_program(LAST,rect.gfx.prog.idx, rect.gfx.vb.groupidx);
 
   fb.render_area = rect; // Store a pointer to the mesh the renderbuffer will render to. 
   fb.render_widget = mesh; // Store a pointer to the mesh

   return rect;
}



export function Framebuffer_moveY(fbidx, y, move_ratio){

   const fb = Framebuffer_get(fbidx);
   const rect = fb.render_area;
   // const mesh = fb.render_widget;
   
   // const i = rect.geom.dim[1] / 900;
   // rect.mat.uv[2] += 0.0011*y   
   // rect.mat.uv[3] += 0.0011*y;
   rect.mat.uv[2] += move_ratio*y   
   rect.mat.uv[3] += move_ratio*y;
   // rect.mat.uv[2] += 0.0001*y   
   // rect.mat.uv[3] += 0.0001*y;
   // console.log(':::::: FRAMEBUFFER: ',rect.mat.uv[2],rect.mat.uv[3])
   // console.log(':::::: FRAMEBUFFER: ',i, rect.geom.dim[1], move_ratio)

   // Gl_set_uv(rect.gfx, rect.mat.uv)
}