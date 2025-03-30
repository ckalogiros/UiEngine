"use strict";

// import { Callback_animations_create } from "../../../../Engine/Animations/CallbackAnimations.js";
// import { Create_widget_button, Create_widget_section } from "../../../../Engine/Core/CreateWidget.js";
// import { Mesh_buffer_get_mesh_byidx } from "../../../../Engine/Core/MeshBuffer.js";
// import { Mesh_unif_get_vb_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
// import { Root_group_activate_all_vbs_in_renderqueue, Root_group_view_buffer_get_byidx } from "../../../../Engine/Core/Views/RootView.js";
// import { GREY, WHITE } from "../../../../Engine/Drawables/Material/Base/Colors.js";
// import { Mesh_set_root_in_focus } from "../../../../Engine/Drawables/Operations/MeshHelperFunctions.js";
// import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../../../Engine/Drawables/Operations/Recursions.js";
// import { Gl_add_dim_xy } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
// import { Function_Slope, Logarithmic_interpolation } from "../../../../Helpers/Math/MathFunctions.js";
// import { Abs } from "../../../../Helpers/Math/MathOperations.js";



// /**This is a generic function for creating this type of menu. The menu items are created from a callback function passed in 'params' from the caller function */
// export function Create_menu_panel(Create_menu_items_clbk=null, menu_items_clbk_params=null){

//    const dim = [
//       (VIEWPORT.WIDTH/2  >= 180) ? 180 : VIEWPORT.WIDTH/2 - 10, 
//       (VIEWPORT.HEIGHT/2 >= 250) ? 250 : VIEWPORT.HEIGHT/2 - 10,
//    ];

//    let zpos = 10;
   
//    const menu_panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 30], [VIEWPORT.WIDTH/2-dim[0], VIEWPORT.HEIGHT/2-dim[1], 10], dim, TRANSPARENCY(GREY[3], .9), 'section', );
//    menu_panel.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//    menu_panel.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 4);
//    menu_panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, menu_panel.geom.dim[0]/10);
//    menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//    menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
//    if (!PLATFORM.ANY_SMARTPHONE_DEVICE) menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
//    menu_panel.SetName('MenuLoadPanel');
   
//    menu_panel.options = SECTION.VERTICAL|SECTION.INHERIT|SECTION.HORIZONTAL_CENTER;

//    zpos++;




//    /*************************************************************************************************/
//    // Menu Options

//    const btn_col = TRANSPARENCY(GREY[1], .8);

//    // Calculate dimentions for small width device
//    const dif = Abs((VIEWPORT.WIDTH/2-10) - dim[0]);
//    let log = (dif>0) ? Math.log(dif) : .2;
//    (log > 1) ? log = 1 : log = log;
//    const pad = (20 * log)


//    // Setup Load Menu Panel callback on button click
//    if(Create_menu_items_clbk !== null) {

//       const menu_items = Create_menu_items_clbk(menu_items_clbk_params);
//       const len = menu_items.length;
//       for(let i=0; i<len; i++){
//          menu_panel.AddItem(menu_items[i]); 
//       }
//    }


   



//    /*******************************************************************************************/
//    // Close button
//    const close_btn = Create_widget_button(_, 'Close', _, [0, 0, zpos], 12, btn_col, WHITE, [dim[0]/2-pad*2, 6], _, _, TEXTURES.MTSDF_COMIC_1024);
//    close_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//    close_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//    close_btn.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//    close_btn.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, close_btn.geom.dim[1]);
//    close_btn.SetName('close_btn');         
//    menu_panel.AddItem(close_btn);

//    const time_step = 0.02, slope_const = 0.2, scale = 2;
//    const function_slope = new Function_Slope(slope_const, time_step, scale);
//    const params = { 
//       is_open: true, 
//       menu_panel: menu_panel,
//       function_slope: function_slope,
//       ratio:menu_panel.geom.dim[1]/menu_panel.geom.dim[0],
//       sizex:menu_panel.geom.dim[0],
//       sizey:menu_panel.geom.dim[1],
//       all_meshes_buffer: Root_group_view_buffer_get_byidx(menu_panel.root_bufferidx),
//    };
//    close_btn.Bind(
//       ()=>{ 
//          Callback_animations_create(Menu_panel_animation_close_run, Menu_panel_animation_close_stop, params)
//       },
//       _, _
//    );


   
   
//    /*************************************************************************************************/
//    // Render Menu 
//    menu_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC|GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);
//    menu_panel.GenGfxCtx();
//    menu_panel.Calc_no_gfx_update();
//    close_btn.MoveNoGfxUpdate( 0, (dim[1]*2) - (close_btn.GetPosY()-menu_panel.GetPosY()));
//    menu_panel.Render();
   

//    Root_group_activate_all_vbs_in_renderqueue(menu_panel.root_bufferidx);
//    Construct_listen_events_from_mesh_tree(menu_panel);
//    Construct_listen_events_relations_from_mesh_tree(menu_panel);
   
//    menu_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, menu_panel.gfx.vb.groupidx);

//    // Set menu in focus
//    Mesh_set_root_in_focus(menu_panel.root_bufferidx, menu_panel.scroller_comp_idx);


//    // Create event callback for the close menu button
//    // const evt_clbk_params = {
//    //    evt_clbks: ()=>{ params.params.menu_panel = null; }, 
//    // }
//    // menu_panel.CreateEventCallback(evt_clbk_params);

//    return menu_panel;

// }



// function Menu_panel_animation_close_run(params){

//    // console.log(params)

//    const menu_panel = params.menu_panel;
   
//    const function_slope = params.function_slope;
//    const slope_constant = function_slope.GetSlope();
//    const scale = function_slope.GetAmmount();
//    function_slope.IncrementTimer();
//    const timer = function_slope.GetTimer();

//    const slope = Logarithmic_interpolation(timer, slope_constant);
//    const size = -((1. - slope) * scale);
//    // menu_panel.geom.SetDimXY(menu_panel.gfx, size, size);
//    // Gl_set_dim_xy(menu_panel.gfx, size, size);
//    menu_panel.geom.dim[0] += size;
//    menu_panel.geom.dim[1] += size*params.ratio;
//    menu_panel.geom.AddDimXY(menu_panel.gfx, size, size*params.ratio);
//    Gl_add_dim_xy(menu_panel.gfx, size, size*params.ratio);

//    // const diffx = menu_panel.geom.pos[0] + ((1. - slope) * scale);
//    // const diffy = menu_panel.geom.pos[1] + ((1. - slope) * scale);
//    // menu_panel.geom.SetWposXY(menu_panel.gfx, diffx, diffy);

//    // if (menu_panel.sid.attr & SID.ATTR.R_CORNERS) {
//    //    Gl_set_attr_round_corners(menu_panel.gfx, menu_panel.mat.style.rcorners * ((1. - slope) + 1));
//    // }

//    for(let i=0; i<=params.all_meshes_buffer.boundary; i++) {
      
//       const mesh = Mesh_buffer_get_mesh_byidx(params.all_meshes_buffer.buffer[i]);
//       // TODO: We need to scale text from its class
//       mesh.geom.dim[0] += size;
//       mesh.geom.dim[1] += size*params.ratio;
//       // mesh.geom.AddDimXY(mesh.gfx, size, size*params.ratio, mesh.geom.num_faces);
//       if((mesh.type & MESH_TYPE.TEXT_MESH)===0) 
//          Gl_add_dim_xy(mesh.gfx, size, size*params.ratio, mesh.geom.num_faces);


//       // {
//       //    const sizex = params.sizex * slope;
//       //    const sizey = params.sizey * slope;
//       //    const difx = sizex - mesh.geom.dim[0];
//       //    const dify = sizey - mesh.geom.dim[1];

//       //    mesh.geom.dim[0] = sizex;
//       //    mesh.geom.dim[1] = sizey;
//       //    mesh.geom.SetDimXY(mesh.gfx, sizex, sizey, mesh.geom.num_faces);
         
//       //    mesh.geom.AddWposXY(mesh.gfx, difx, dify, mesh.geom.num_faces);
         
//       //    if((mesh.type & MESH_TYPE.TEXT_MESH)===0) {

//       //       Gl_set_dim_xy(mesh.gfx, sizex, sizey);
//       //       // if (mesh.sid.attr & SID.ATTR.R_CORNERS) {
//       //       //    mesh.mat.style.rcorners = rcorners * slope;
//       //       //    Gl_set_attr_round_corners(mesh.gfx, mesh.mat.style.rcorners);
//       //       // }
//       //    }
//       // }
//    }



//    // if (slope > 1.) return false;
//    if (menu_panel.geom.dim[0] < 10) return false;
//    return true

// }
// function Menu_panel_animation_close_stop(){console.log('end')}