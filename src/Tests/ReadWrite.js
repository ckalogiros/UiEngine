import { M_Buffer } from "../scripts/Engine/Core/Buffers";
import { Create_widget_multi_text, Create_widget_section } from "../scripts/Engine/Core/CreateWidget";
import { Mesh_buffer_get } from "../scripts/Engine/Core/MeshBuffer";
import { PerformanceTimersGetBestFps, PerformanceTimersGetFps, PerformanceTimersGetWorstFps, Performance_timers_get_avg_1sec_reset, _pt_test_misc_1, _pt_test_misc_2, _pt_test_misc_3, _pt_test_misc_4 } from "../scripts/Engine/Timers/PerformanceTimers";



export function Create_read_write_test() {

   const section = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [400, 500, 0], [0, 0], TRANSPARENCY(GREY1, .8), 'ui performance timers panel');
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.SetName('InfoUi-PerformanceTimers section');

   const timer1 = _pt_test_misc_1.timer;
   const timer2 = _pt_test_misc_2.timer;
   const timer3 = _pt_test_misc_3.timer;
   const timer4 = _pt_test_misc_4.timer;

   { // 
      const ms = 1000;
      const fontsize = 8;
      const pad = 0;

      const ui = Create_widget_multi_text(_, 'Test:read-write: | avg:', ALIGN.HORIZONTAL, [0, 0, 0], fontsize, GREY7, .5);
      section.AddItem(ui);

      ui.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [pad * 3, 0], .9);
      ui.SetDynamicText(`ms${ms} Test:read-write avg`, ms, PerformanceTimersGetFps, timer1); // idx is for use in creating separate time intervals for each dynamic text.

      ui.CreateNewText('| avg_1sec:', fontsize, GREY7, [pad * 3, 0], .9);
      ui.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
      ui.SetDynamicText(`ms${ms} Test:read-write 1secReset`, ms, Performance_timers_get_avg_1sec_reset, _pt_test_misc_1)

      ui.CreateNewText('| best:', fontsize, GREY7, [pad * 3, 0], .9);
      ui.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
      ui.SetDynamicText(`ms${ms} Test:read-write best`, ms, PerformanceTimersGetBestFps, timer1)

      ui.CreateNewText('| worst:', fontsize, GREY7, [pad * 3, 0], .9);
      ui.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
      ui.SetDynamicText(`ms${ms} Test:read-write worst`, ms, PerformanceTimersGetWorstFps, timer1)

   }
   { // 
      const ms = 1000;
      const fontsize = 8;
      const pad = 0;

      const ui = Create_widget_multi_text(_, 'Test:readwrite2: | avg:', ALIGN.HORIZONTAL, [0, 0, 0], fontsize, GREY7, .5);
      section.AddItem(ui);

      ui.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [pad * 3, 0], .9);
      ui.SetDynamicText(`ms${ms} Test:read-write2 avg`, ms, PerformanceTimersGetFps, timer2); // idx is for use in creating separate time intervals for each dynamic text.

      ui.CreateNewText('| avg_1sec:', fontsize, GREY7, [pad * 3, 0], .9);
      ui.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
      ui.SetDynamicText(`ms${ms} Test:read-write2 1secReset`, ms, Performance_timers_get_avg_1sec_reset, _pt_test_misc_2)

      ui.CreateNewText('| best:', fontsize, GREY7, [pad * 3, 0], .9);
      ui.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
      ui.SetDynamicText(`ms${ms} Test:read-write2 best`, ms, PerformanceTimersGetBestFps, timer2)

      ui.CreateNewText('| worst:', fontsize, GREY7, [pad * 3, 0], .9);
      ui.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
      ui.SetDynamicText(`ms${ms} Test:read-write2 worst`, ms, PerformanceTimersGetWorstFps, timer2)

   }
   // { // 
   //    const ms = 1000;
   //    const fontsize = 8;
   //    const pad = 0;

   //    const ui = Create_widget_multi_text(_, 'Test:readwrite4: | avg:', ALIGN.HORIZONTAL, [0, 0, 0], fontsize, GREY7, .5);
   //    section.AddItem(ui);

   //    ui.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [pad * 3, 0], .9);
   //    ui.SetDynamicText(`ms${ms} Test:read-write2 avg`, ms, PerformanceTimersGetFps, timer4); // idx is for use in creating separate time intervals for each dynamic text.

   //    ui.CreateNewText('| avg_1sec:', fontsize, GREY7, [pad * 3, 0], .9);
   //    ui.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
   //    ui.SetDynamicText(`ms${ms} Test:read-write2 1secReset`, ms, Performance_timers_get_avg_1sec_reset, _pt_test_misc_4)

   //    ui.CreateNewText('| best:', fontsize, GREY7, [pad * 3, 0], .9);
   //    ui.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
   //    ui.SetDynamicText(`ms${ms} Test:read-write2 best`, ms, PerformanceTimersGetBestFps, timer4)

   //    ui.CreateNewText('| worst:', fontsize, GREY7, [pad * 3, 0], .9);
   //    ui.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
   //    ui.SetDynamicText(`ms${ms} Test:read-write2 worst`, ms, PerformanceTimersGetWorstFps, timer4)

   // }
   { // 
      const ms = 1000;
      const fontsize = 8;
      const pad = 0;

      const ui = Create_widget_multi_text(_, 'Test:readwrite3: | avg:', ALIGN.HORIZONTAL, [0, 0, 0], fontsize, GREY7, .5);
      section.AddItem(ui);

      ui.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [pad * 3, 0], .9);
      ui.SetDynamicText(`ms${ms} Test:read-write2 avg`, ms, PerformanceTimersGetFps, timer3); // idx is for use in creating separate time intervals for each dynamic text.

      ui.CreateNewText('| avg_1sec:', fontsize, GREY7, [pad * 3, 0], .9);
      ui.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
      ui.SetDynamicText(`ms${ms} Test:read-write2 1secReset`, ms, Performance_timers_get_avg_1sec_reset, _pt_test_misc_3)

      ui.CreateNewText('| best:', fontsize, GREY7, [pad * 3, 0], .9);
      ui.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
      ui.SetDynamicText(`ms${ms} Test:read-write2 best`, ms, PerformanceTimersGetBestFps, timer3)

      ui.CreateNewText('| worst:', fontsize, GREY7, [pad * 3, 0], .9);
      ui.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
      ui.SetDynamicText(`ms${ms} Test:read-write2 worst`, ms, PerformanceTimersGetWorstFps, timer3)

   }
   { // 
      const ms = 1000;
      const fontsize = 8;
      const pad = 0;

      const ui = Create_widget_multi_text(_, 'Test:readwrite4: | avg:', ALIGN.HORIZONTAL, [0, 0, 0], fontsize, GREY7, .5);
      section.AddItem(ui);

      ui.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [pad * 3, 0], .9);
      ui.SetDynamicText(`ms${ms} Test:read-write2 avg`, ms, PerformanceTimersGetFps, timer4); // idx is for use in creating separate time intervals for each dynamic text.

      ui.CreateNewText('| avg_1sec:', fontsize, GREY7, [pad * 3, 0], .9);
      ui.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
      ui.SetDynamicText(`ms${ms} Test:read-write2 1secReset`, ms, Performance_timers_get_avg_1sec_reset, _pt_test_misc_4)

      ui.CreateNewText('| best:', fontsize, GREY7, [pad * 3, 0], .9);
      ui.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
      ui.SetDynamicText(`ms${ms} Test:read-write2 best`, ms, PerformanceTimersGetBestFps, timer4)

      ui.CreateNewText('| worst:', fontsize, GREY7, [pad * 3, 0], .9);
      ui.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
      ui.SetDynamicText(`ms${ms} Test:read-write2 worst`, ms, PerformanceTimersGetWorstFps, timer4)

   }

   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
   section.Calc(SECTION.VERTICAL);
   section.Render();
   section.ConstructListeners();

   // Create_root_widget_buffer(section);
   // Create_widget_tree_from_root(section);
}

export function Update_read_write_test() {
   Test_write_all_meshes();
   Test_write_all_meshes2();
   // Test_write_all_meshes2_1();
   Test_write_all_meshes3();
   Test_write_all_meshes4()
}



/**************************************************************** */
function Test_write_all_meshes() {

   const timer = _pt_test_misc_1.timer;

   const mesh_buffer = Mesh_buffer_get();
   let buffer = [];

   timer.Start();

   for (let i = 0; i < mesh_buffer.boundary; i++) {

      const mesh = mesh_buffer.buffer[i];
      if (mesh.gfx) {
         buffer.push(mesh);
      }
   }

   timer.Stop();

   // Clear buffer
   buffer = [];
}

/**************************************************************** */
let buffer = new M_Buffer();
function Test_write_all_meshes2() {

   const timer = _pt_test_misc_2.timer;

   const mesh_buffer = Mesh_buffer_get();

   if (buffer.size === INT_NULL) buffer.Init(mesh_buffer.boundary);

   timer.Start();


   for (let i = 0; i < mesh_buffer.boundary; i++) {

      const mesh = mesh_buffer.buffer[i];
      if (mesh.gfx) {
         buffer.Add(mesh);
      }
   }

   timer.Stop();

   // Clear buffer
   buffer.active_count = 0;
   buffer.boundary = 0;
}

/**************************************************************** */
let buffer2 = new M_Buffer();
// function Test_write_all_meshes2_1_init() {

//    // buffer2.Add(new M_Buffer());

//    const progs = Progarm_get_program();
//    for (let ii = 0; ii < 2; ii++) {

//       buffer2.Add(new M_Buffer());

//       for (let i = 0; i < progs.count; i++) {

//          buffer2.buffer[ii].Add(new M_Buffer);
//          const vb = Vertex_buffer_info_get_by_vbidx(i);

//          for (let j = 0; j < vb.count; j++) {
//             buffer2.buffer[ii].buffer[i].Add(new M_Buffer)
//          }
//       }
//    }

//    console.log('++++++ BUFFER2', buffer2)
// }
function Test_write_all_meshes2_1() {

   const timer = _pt_test_misc_4.timer;

   const mesh_buffer = Mesh_buffer_get();

   // if (buffer2.size === INT_NULL) buffer.Init(mesh_buffer.boundary);

   timer.Start();


   for (let i = 0; i < mesh_buffer.boundary; i++) {

      const mesh = mesh_buffer.buffer[i];

      if (mesh.gfx) {
         const i = mesh.gfx.prog.groupidx;
         const j = mesh.gfx.prog.idx;
         const k = mesh.gfx.vb.idx;

         if (!buffer2.buffer) {
            buffer2.Add(new M_Buffer());
         }
         if (!buffer2.buffer[i]) {
            for (let ii = buffer2.boundary; ii < i; ii++)
               buffer2.buffer = new M_Buffer();
         }
         if (!buffer2.buffer[i].buffer) {
            buffer2.buffer[i].Add(new M_Buffer());
         }
         if (!buffer2.buffer[i].buffer[j]) {
            for (let ii = buffer2.buffer[i].boundary; ii <= j; ii++)
               buffer2.buffer[i].buffer[j] = new M_Buffer();
         }
         if (!buffer2.buffer[i].buffer[j].buffer) {
            buffer2.buffer[i].buffer[j].Add(new M_Buffer());
         }
         if (!buffer2.buffer[i].buffer[j].buffer[k]) {
            for (let ii = buffer2.buffer[i].boundary; ii <= k; ii++)
               buffer2.buffer[i].buffer[j].buffer[k] = new M_Buffer();

            console.log('++++++ BUFFER2', buffer2)
         }
         // if (!buffer2.buffer[i].buffer[j]) {
         //    buffer2.buffer[i].buffer[j].Add(new M_Buffer());
         // }
         // if (!buffer2.buffer[i].buffer[j].buffer) {
         //    for (let ii = buffer2.buffer[i].boundary; ii < j; ii++) 
         //       buffer2.buffer[i].buffer[j].buffer = new M_Buffer();
         // }
         // if (!buffer2.buffer[i].buffer[j]) {
         //       buffer2.buffer[i].buffer[j].Add(new M_Buffer());
         // }
         // if (!buffer2.buffer[i].buffer[j].buffer) {
         //    for (let ii = buffer2.buffer[i].buffer[j].boundary; ii < i; ii++) 
         //    buffer2.buffer[i].buffer[j].buffer = new M_Buffer();
         // }


         buffer2.buffer[i].buffer[j].buffer[k].Add(mesh);
      }
   }

   timer.Stop();

   // Clear buffer
   buffer.active_count = 0;
   buffer.boundary = 0;
}

/**************************************************************** */
let _groups = [];
function Test_write_all_meshes3() {

   const timer = _pt_test_misc_3.timer;
   const mesh_buffer = Mesh_buffer_get();


   timer.Start();

   for (let ii = 0; ii < mesh_buffer.boundary; ii++) {

      const mesh = mesh_buffer.buffer[ii];
      if (mesh.gfx) {

         const i = mesh.gfx.prog.groupidx;
         const j = mesh.gfx.prog.idx;
         const k = mesh.gfx.vb.idx;

         if (!_groups[i]) { _groups[i] = []; }
         if (!_groups[i][j]) { _groups[i][j] = []; }
         if (!_groups[i][j][k]) { _groups[i][j][k] = []; }

         _groups[i][j][k].push(mesh)
      }
   }

   timer.Stop();

   // Clear buffer
   _groups = [];

}

/**************************************************************** */
const _groups2 = [];
_groups2[0] = [];
_groups2[1] = [];
// MAX PROGRAMS. Here we assume the max gl programs are 5
let progs = [INT_NULL, INT_NULL, INT_NULL, INT_NULL, INT_NULL];
_groups2[0][0] = [];
_groups2[0][1] = [];
_groups2[0][2] = [];
_groups2[0][3] = [];
_groups2[0][4] = [];
_groups2[1][0] = [];
_groups2[1][1] = [];
_groups2[1][2] = [];
_groups2[1][3] = [];
_groups2[1][4] = [];
let progscnt = 0;
// MAX vertex buffers (of a program)
const vbs = [INT_NULL, INT_NULL, INT_NULL, INT_NULL, INT_NULL, INT_NULL];
let vbscnt = 0;

/**DEBUG*/let flag = false;
function Test_write_all_meshes4() {

   const timer = _pt_test_misc_4.timer;
   const mesh_buffer = Mesh_buffer_get();


   timer.Start();

   for (let ii = 0; ii < mesh_buffer.boundary; ii++) {

      const mesh = mesh_buffer.buffer[ii];
      if (mesh.gfx) {

         const i = mesh.gfx.prog.groupidx;
         const j = mesh.gfx.prog.idx;
         const k = mesh.gfx.vb.idx;

         if (progs[j] === INT_NULL) {
            progs[j] = progscnt++;
         }
         // if (vbs[k] === INT_NULL) {
         //    vbs[k] = vbscnt;
         //    _groups2[i][progs[j]][vbs[k]] = [];
         //    vbscnt++
         // }
         // if (_groups2[i][progs[j]][vbs[k]] === _) {
         //    _groups2[i][progs[j]][vbs[k]] = [];
         // }
         if (_groups2[i][progs[j]][vbs[k]] === _) {
            if (vbs[k] === INT_NULL) {
               vbs[k] = vbscnt;
               _groups2[i][progs[j]][vbs[k]] = [];
               vbscnt++
            }
            _groups2[i][progs[j]][vbs[k]] = [];
         }

         _groups2[i][progs[j]][vbs[k]].push(mesh)
      }
   }

   /**DEBUG DO NOT DELETE */
   // if (!flag) {
   //    console.log(`progs[]:${progs} vbs[]:${vbs}  `);
   //    for (let ii = 0; ii < _groups2.length; ii++) {
   //       if(_groups2[ii]){
   //          for (let jj = 0; jj < _groups2[ii].length; jj++) {
   //             if(_groups2[ii][jj]){
   //                for (let kk = 0; kk < _groups2[ii][jj].length; kk++) {
   //                   if(_groups2[ii][jj][kk]){
   //                      for (let ll = 0; ll < _groups2[ii][jj][kk].length; ll++) {
   //                         console.log(`group${ii} prog${jj} vb${kk} mesh${ll} ${_groups2[ii][jj][kk][ll].name}`)
   //                      }
   //                   }
   //                }
   //             }
   //          }
   //       }
   //    }
   //    flag = true;
   // }

   timer.Stop();


   // Clear buffer
   _groups2[0][progs[0]] = [];
   _groups2[0][progs[1]] = [];
   _groups2[0][progs[2]] = [];
   _groups2[0][progs[3]] = [];
   _groups2[0][progs[4]] = [];
   _groups2[1][progs[0]] = [];
   _groups2[1][progs[1]] = [];
   _groups2[1][progs[2]] = [];
   _groups2[1][progs[3]] = [];
   _groups2[1][progs[4]] = [];
   progscnt = 0;
   vbscnt = 0;
   // Reset the progs. We check for INT_NULL on every call.
   progs = [INT_NULL, INT_NULL, INT_NULL, INT_NULL, INT_NULL];

} 