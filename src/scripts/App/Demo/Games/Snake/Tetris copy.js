"use strict";

import { Callback_animations_create } from "../../../../Engine/Animations/CallbackAnimations.js";
import { Input_keyboard_bind_keydown_callback, Input_keyboard_bind_keyup_callback } from "../../../../Engine/Controls/Input/Keyboard.js";
import { New_generic_buffer, New_int16_buffer, New_int8_buffer } from "../../../../Engine/Core/Buffers.js";
import { Create_widget_section } from "../../../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../../../Engine/Core/Views/RootView.js";
import { GREEN, GREY, PURPLE, REDL, YELLOW } from "../../../../Engine/Drawables/Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../../../Engine/Drawables/Operations/Recursions.js";
import { Time_intervals_create } from "../../../../Engine/Timers/TimeIntervals.js";
import { Gl_add_wpos_xy, Gl_add_wpos_y, Gl_set_rgb, Gl_set_wpos_x, Gl_set_wpos_xy, Gl_set_wpos_y } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { Gen_array_check_for_existing_element } from "../../../../Helpers/GenericFunctions.js";
import { Abs, Floor, Fract, Min3 } from "../../../../Helpers/Math/MathOperations.js";




const DEBUG_PRINT = true;
// const DEBUG_NOT_MOVE_DOWN = true;
const DEBUG_NOT_MOVE_DOWN = false;




_CNT=0x1;
const TETRIS_TOKEN_IDS = {
   DEF:_CNT,
   LINE:_CNT<<=0x1,
}
 /**
  * NEDDS TO BE RE-IMPLEMENTED
  * 
  * On one hand we need tokens, to abstract 4 meshes to a token(move, rotate, same color)
  * On the other hand, when a token is placed, then it needs to be abstacted as rows.
  * That means the tokens when created must use a pool of free meshes (rects) instead of only free tokens,
  * otherwise there will be conflicts of tokens that one of its mesh should be removed and not the other
  */


const MAX_COLUMNS = 5;
const TOKEN_SIZE = 40;
const MAX_TOKENS_IN_Y_AXIS = 10;
const TOP_ROW = MAX_TOKENS_IN_Y_AXIS-1;
const ROW_HEIGHT = TOKEN_SIZE*2;
const COL_WIDTH = TOKEN_SIZE*2;
const TETRIS_PANEL_HEIGHT = MAX_TOKENS_IN_Y_AXIS*TOKEN_SIZE;
const TETRIS_PANEL_WIDTH = TOKEN_SIZE*MAX_COLUMNS;
const tetris_panel_pad = 10;
let speed = .5;
const def_speed = speed;


let abort = false;
let in_remove_row_animation = false;
let tetris_end = false;

let complete_rows_cell_idxs = [];
let complete_rows_idxs = [];


let new_pos_x = 0;
let new_pos_y = 0;


/*********************************************************************************************************/
// Keyboard input
function Keyboard_input_keydown(params) {
   
   const key = params.key;
   const keycode = params.event.keyCode;
   // console.log(key, keycode);
   
   if(keycode === INPUT_KEYCODE_PAUSE) {
      // console.log(_grid_columns)
      // if(STATE.loop.paused === false)
      //    STATE.loop.paused = true;
      // else STATE.loop.paused = false;
   }
   
   if(keycode === INPUT_KEYCODE_LEFT){
      curr_token.MoveLeft();
   }
   else if(keycode === INPUT_KEYCODE_RIGHT){
      curr_token.MoveRight();
   }
   else if(keycode === INPUT_KEYCODE_DOWN){
      speed = 10;
   }
   else if(keycode === INPUT_KEYCODE_SPACE){
      curr_token.RotateRight()
   }
   else if(keycode === INPUT_KEYCODE_D){
      curr_token.RotateRight()
   }
   else if(keycode === INPUT_KEYCODE_A){
      curr_token.RotateLeft()
   }
}
function Keyboard_input_keyup(params) {
   
   const key = params.key;
   const keycode = params.event.keyCode;
   // console.log(key, keycode);
   
   
   if(keycode === INPUT_KEYCODE_DOWN){
      speed = def_speed;
   }
}




/*********************************************************************************************************/
// Buffers
const _grid_columns = New_generic_buffer(_, 'TetrisGridColumns');
const _cells_buffer = New_generic_buffer(_, 'TetrisCells');
const _free_cells_buffer = New_int16_buffer(16, 'TetrisFreeCells');



/*********************************************************************************************************/
// Grid functions
function Tetris_initialize_grid() {


   for(let i=0; i<MAX_COLUMNS; i++){
      
      const num_tokens_height = TETRIS_PANEL_HEIGHT / TOKEN_SIZE;
      const col_idxs = New_int16_buffer(num_tokens_height, `TetrisColumn${i}`);

      _grid_columns.Add(col_idxs);
   }

}
function Grid_get_colidx_from_posx(xpos) {

   const x = xpos - tetris_panel_pad - TOKEN_SIZE;
   const col_idx = (x!==0) ? x / COL_WIDTH : 0;
   
   if(Fract(col_idx))
      console.error('3312241544321 col_idx is not an int')

   return col_idx;
}
function Grid_get_rowidx_from_posy(ypos) {

   const y = ypos - tetris_panel_pad - TOKEN_SIZE;
   const row_idx = (y!==0) ? TOP_ROW - Floor(y / ROW_HEIGHT) : 0;
   return row_idx;
   // return Floor(row_idx);
}
function Grid_get_posy_from_rowidx(rowidx) {

   const y = (TOP_ROW-rowidx) * ROW_HEIGHT;
   return y;
}
function Grid_get_posx_from_colidx(colidx) {

   const x = (colidx * COL_WIDTH) + TOKEN_SIZE + 10;
   return x;
}
function Grid_remove_row(row_idx) {

   for(let i=0; i<MAX_COLUMNS; i++){
      
      // Store all removed cells as to a buffer 'free'
      Cell_store_free_cell(_grid_columns.buffer[i].buffer[row_idx]);

      // Shift elements left from the row index and after
      _grid_columns.buffer[i].ShiftLeftFromBaseIndex(row_idx);
      // _grid_columns.buffer[i].ShiftLeft();
   }


   
   // console.log('_free_cells_buffer', _free_cells_buffer)
   // console.log('REMOVE ROW: row_idx', row_idx, _grid_columns.buffer)

}
function Grid_move_all_down(y, rowidx) {

   for(let i=0; i<MAX_COLUMNS; i++){
      
      const col = _grid_columns.buffer[i];

      for(let j=rowidx; j <= col.boundary; j++){

         const cellidx = col.buffer[j];
         if(cellidx !== INT_NULL) {

            const mesh = _cells_buffer.buffer[cellidx];
            mesh.geom.pos[1] += y;
            Gl_add_wpos_y(mesh.gfx, y, 1);
         }
      }

   }

}
function Grid_add_cells_from_token(token){

   for(let i=0; i<token.num_cells; i++) {

      const cellidx = token.cells.buffer[i];
      // const mesh = _cells_buffer.buffer[cellidx];
      const col_idx = token.cols[i];
      const row_idx = token.rows[i];
      console.log('ADDING TOKEN:', 'col_idx', col_idx, 'row_idx', row_idx, 'cellidx', cellidx);


      if(col_idx >= MAX_TOKENS_IN_Y_AXIS) tetris_end = true;
      // if(row_idx >= MAX_COLUMNS) tetris_end = true;
   
      _grid_columns.buffer[col_idx].AddAtIndex(row_idx, cellidx);

   }

}
function Grid_check_row_completion(token_cells_rows) {

   if(in_remove_row_animation) return;

   console.log('---- CHECKING ROWS ----')

   let complete_rows_cnt = 0; // A row counter to run for all completed rows
   
   const len = token_cells_rows.length;
   let is_row_complete = false;
   
   let rowidx = INT_NULL;
   for(let j=0; j<len; j++){
      
      let cell_cnt = 0;

      // Avoid repeat same rows, by checking the prev row(Row indexes MUST be sorted) 
      // if(token_cells_rows[j] <= rowidx) break; 
      
      rowidx = token_cells_rows[j];
      
      // Check if row is complete
      for(let i=0; i<MAX_COLUMNS; i++){
         
         const col = _grid_columns.buffer[i];

         if(col.buffer[rowidx] !== INT_NULL){

            cell_cnt++; // add all existing tokens of this row.

            if(cell_cnt === MAX_COLUMNS) {
               complete_rows_idxs.push(rowidx);

               is_row_complete = true; // Is at least one row complete
               break;
            }
         }
         else break; // Break if at least one cell is missing for a complete row
      }

         // If the number of cells in a row are equal to the number of columns, we have a completed row
         // Push all row tokens to a buffer so we can remove them 
         if(complete_rows_idxs[complete_rows_cnt] !== undefined) {
         for(let i=0; i<MAX_COLUMNS; i++){
               const cell_idx = _grid_columns.buffer[i].buffer[complete_rows_idxs[complete_rows_cnt]];
               complete_rows_cell_idxs.push(cell_idx);
         }
         complete_rows_cnt++;
      }
   }



   if(is_row_complete) {
      console.log('@#$@#$ @#$@#$ @#$@#$ @#$@#$ @#$@#$ @#$@#$');
      console.log('complete_rows_cell_idxs', complete_rows_cell_idxs, 'complete_rows_idxs', complete_rows_idxs);
      Create_row_animation(complete_rows_cell_idxs, complete_rows_idxs);
   }
}













/*********************************************************************************************************/
// Mesh functions
function Cell_create(offsetx=0, offsety=0, col){

   const color = col!==undefined ? col : YELLOW[9];
   const mesh = Create_widget_section(_, _, [0, 0], [10+(TOKEN_SIZE*2*offsetx), 10+(TOKEN_SIZE*2*offsety),0], [TOKEN_SIZE, TOKEN_SIZE], color, 'mesh');
   mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   
   const cellidx = _cells_buffer.Add(mesh);

   return {
      mesh:mesh,
      idx:cellidx,
   };
}
function Cell_store_free_cell(cellidx) {
   _free_cells_buffer.Add(cellidx);
}
function Cell_get_free_cell() {

   const last_elem = _free_cells_buffer.boundary;
   if(last_elem >= 0) {

      const free_cell_idx = _free_cells_buffer.buffer[last_elem];
      _free_cells_buffer.RemoveByIdxSortedVersionLastElemGuarantee();
      return free_cell_idx;
   }

   return INT_NULL;
}



/**
 * TOKENS
 * 
 * Line:
 *    o 
 *    o  o o o o
 *    o
 *    o
 * 
 * Rotate horizontal: Take the ypos of the second cell, and occupy from -1 cell(being inside boundaries) to +3 cell
 * Rotate vertical: Take the ypos of the second cell, and occupy from -1 to +3
 */





function Mat2_mult_vec2(mat, x, y){

   return [
      (mat[0][0] * x) + (mat[0][1] * y),
      (mat[1][0] * x) + (mat[1][1] * y),
   ];
}

const mat_rot_90_clockwise = [
   [0, 1],
   [-1, 0]
];
const mat_rot_90_counterclockwise = [
   [0, -1],
   [1, 0]
];


function Min_of_4(arr4){
   const min = arr4[0] < arr4[1] ? arr4[0] : arr4[1] < arr4[2] ? arr4[1] : arr4[2] < arr4[3] ? arr4[2] : arr4[3];
   return min;
}
function Max_of_4(arr4){
   const max = arr4[0] > arr4[1] ? arr4[0] : arr4[1] > arr4[2] ? arr4[1] : arr4[2] > arr4[3] ? arr4[2] : arr4[3];
   return max;
}
function Token_get_left_most_col(cols){
   return Min_of_4(cols);
}
function Token_get_right_most_col(cols){
   return Max_of_4(cols);
}
function Token_get_lower_most_row(rows){
   return Min_of_4(rows);
}



/*********************************************************************************************************/
// Tokens

class Token {
   
   constructor(){
      
      this.num_cells = 0;
      this.cells = New_int16_buffer(4, 'TetrisTokenCells');

      this.cols = new Int16Array([INT_NULL, INT_NULL, INT_NULL, INT_NULL]);
      this.rows = new Int16Array([INT_NULL, INT_NULL, INT_NULL, INT_NULL]);
      this.cols_cnt = 0;
      this.rows_cnt = 0;

      this.dist = Grid_get_posy_from_rowidx(TOP_ROW); // A value between 0 and column height, to measure the passing to the next row

      this.right_most_col = INT_NULL;
      this.left_most_col = INT_NULL;
      
      this.lower_row_idx = TOP_ROW;
   }
   Reset(){
      this.cells.Reset();
      this.cols[0] = INT_NULL; this.cols[1] = INT_NULL; this.cols[2] = INT_NULL; this.cols[3] = INT_NULL;
      this.rows[0] = INT_NULL; this.rows[1] = INT_NULL; this.rows[2] = INT_NULL; this.rows[3] = INT_NULL;
      this.cols_cnt = 0;
      this.rows_cnt = 0;
      this.right_most_col = INT_NULL;
      this.left_most_col = INT_NULL; 
      this.dist = 0;
      this.lower_row_idx = TOP_ROW;
      this.num_cells = 0;
   }
   AddCell(cellidx, colidx, rowidx){

      this.cells.Add(cellidx);

      this.cols[this.num_cells] = colidx; // Put tokens rect to 0-th column
      this.rows[this.num_cells] = rowidx; // Put tokens rect to top row
      
      if((colidx > this.right_most_col)) this.right_most_col = colidx
      if((colidx < this.left_most_col) || this.left_most_col===INT_NULL) this.left_most_col = colidx

      this.num_cells++;
   }
   RotateLeft(){

      // Pivot (x,y)
      const px = this.cols[0], py = this.rows[0];
      let needs_moving_left = false, needs_moving_right = false;
      let move_cols = 1;
      for(let i = 1; i < this.num_cells; i++) {

         const res = Mat2_mult_vec2(mat_rot_90_clockwise, this.cols[i]-px, this.rows[i]-py);

         const new_col = res[0]+px;
         const new_row = res[1]+py;

         // Case the rotaing token is out of boundaries
         if(new_col < 0) {
            needs_moving_right = true;
            move_cols = Abs(new_col);
            console.error('<')
         }
         if(new_col >= MAX_COLUMNS) {
            needs_moving_left = true;
            move_cols = new_col - (MAX_COLUMNS-1);
            console.error('>', new_col)
         }
         
         const mesh_idx = this.cells.buffer[i];
         const mesh = _cells_buffer.buffer[mesh_idx];
         const x = (new_col * COL_WIDTH) + tetris_panel_pad;
         const y =  (TOP_ROW-new_row) * ROW_HEIGHT +  + tetris_panel_pad + this.dist;
         mesh.geom.pos[0] = x;
         mesh.geom.pos[1] = y;
         Gl_set_wpos_xy(mesh.gfx, x+TOKEN_SIZE, y+TOKEN_SIZE);

         this.cols[i] = new_col;
         this.rows[i] = new_row;

      }

      if(needs_moving_left) this.MoveLeft();
      if(needs_moving_right) this.MoveRight();

      this.left_most_col = Token_get_left_most_col(this.cols);
      this.right_most_col = Token_get_right_most_col(this.cols);
      this.lower_row_idx = Token_get_lower_most_row(this.rows);
      // console.log( '\nthis.left_most_col', this.left_most_col, 'this.right_most_col', this.right_most_col, 'this.lower_row_idx',this.lower_row_idx)

   }
   RotateRight(){

      // Pivot (x,y)
      const px = this.cols[0], py = this.rows[0];
      let needs_moving_left = false, needs_moving_right = false;
      let move_cols = 1;
      for(let i = 1; i < this.num_cells; i++) {

         const res = Mat2_mult_vec2(mat_rot_90_counterclockwise, (this.cols[i]-px), (this.rows[i]-py));

         const new_col = res[0]+px;
         const new_row = res[1]+py;
         
         // Case the rotaing token is out of boundaries
         if(new_col < 0) {
            needs_moving_right = true;
            move_cols = Abs(new_col);
         }
         if(new_col >= MAX_COLUMNS-1) {
            needs_moving_left = true
            move_cols = new_col - (MAX_COLUMNS-1);
         }
         
         const mesh_idx = this.cells.buffer[i];
         const mesh = _cells_buffer.buffer[mesh_idx];
         const x = new_col  * COL_WIDTH + tetris_panel_pad;
         const y =  (TOP_ROW-new_row) * ROW_HEIGHT + tetris_panel_pad + this.dist;
         mesh.geom.pos[0] = x;
         mesh.geom.pos[1] = y;
         Gl_set_wpos_xy(mesh.gfx, x+TOKEN_SIZE, y+TOKEN_SIZE);

         this.cols[i] = new_col;
         this.rows[i] = new_row;
         
      }

      {
         // const mesh_idx = this.cells.buffer[0];
         // const mesh = _cells_buffer.buffer[mesh_idx];
         // mesh.geom.pos[1] += this.dist;
         // Gl_add_wpos_y(mesh.gfx, this.dist);
      }
      
      if(needs_moving_left) this.MoveLeft(move_cols);
      if(needs_moving_right) this.MoveRight(move_cols);

      this.left_most_col = Token_get_left_most_col(this.cols);
      this.right_most_col = Token_get_right_most_col(this.cols);
      this.lower_row_idx = Token_get_lower_most_row(this.rows);

      // console.log( '\nthis.left_most_col', this.left_most_col, 'this.right_most_col', this.right_most_col,)
   }
   MoveLeft(move_cols=1){

      const col_idx = this.left_most_col;
      if(col_idx > 0){

         for(let i=0; i<this.num_cells; i++) {

            if(this.num_cells < 3) alert('009989098 token should have 4 cells in this Move() implementation')

            this.cols[i]-=move_cols;
            
            // Move cell
            const mesh = _cells_buffer.buffer[this.cells.buffer[i]];
            const posx = Grid_get_posx_from_colidx(this.cols[i]);
            mesh.geom.pos[0] = posx-TOKEN_SIZE;
            Gl_set_wpos_x(mesh.gfx, posx, 1);
         }

         this.right_most_col-=move_cols; // If we moved to the right, then increment the right most token's column index
         this.left_most_col-=move_cols; // If we moved to the right, then increment the left most token's column index
      }

   }
   MoveRight(move_cols=1){

      const col_idx = this.right_most_col;
      if(col_idx < MAX_COLUMNS-1){

         for(let i=0; i<this.num_cells; i++) {

            if(this.num_cells < 3) alert('009989098 token should have 4 cells in this Move() implementation')

            this.cols[i]+=move_cols;
            
            // Move cell
            const mesh = _cells_buffer.buffer[this.cells.buffer[i]];
            const posx = Grid_get_posx_from_colidx(this.cols[i]);
            mesh.geom.pos[0] = posx-TOKEN_SIZE;
            Gl_set_wpos_x(mesh.gfx, posx, 1);
         }

         this.right_most_col+=move_cols; // If we moved to the right, then increment the right most token's column index
         this.left_most_col+=move_cols; // If we moved to the right, then increment the left most token's column index
      }

      // console.log('MOVE_RIGHT: cols', this.cols);

   }
   MoveDown(move){

      this.dist += move;

      for(let i=0; i<this.num_cells; i++){
         
         const mesh = _cells_buffer.buffer[this.cells.buffer[i]];
         mesh.geom.pos[1] += move;
         Gl_add_wpos_y(mesh.gfx, move, 1);
         
         // Decrement rows for each cell
         if(this.dist >= ROW_HEIGHT && this.rows[i] !== INT_NULL) {
            this.rows[i]--;
         }
      }


      // Advance lower row counter
      if(this.dist >= ROW_HEIGHT) {
         this.lower_row_idx--;
         this.dist = 0;
         // console.log( '\nthis.left_most_col', this.left_most_col, 'this.right_most_col', this.right_most_col, 'this.lower_row_idx',this.lower_row_idx)

      }
   }
   AddPosXY(x, y){
      for(let i=0; i<this.num_cells; i++){
         const mesh = _cells_buffer.buffer[this.cells.buffer[i]];
         mesh.geom.pos[1] += x;
         mesh.geom.pos[1] += y;
         Gl_add_wpos_xy(mesh.gfx, y, 1);
      }
   }
   AddPosY(y){
      for(let i=0; i<this.num_cells; i++){
         const mesh = _cells_buffer.buffer[this.cells.buffer[i]];
         mesh.geom.pos[1] += y;
         Gl_add_wpos_y(mesh.gfx, y, 1);
      }
   }
   SetPosY(y){
      for(let i=0; i<this.num_cells; i++){
         const mesh = _cells_buffer.buffer[this.cells.buffer[i]];
         mesh.geom.pos[1] = y;
         Gl_set_wpos_y(mesh.gfx, y, 1);
      }
   }


}


let curr_token = null;

function Tetris_create_token_test(section, token){


   const row = 4;
   {
      const colidx = 1;
      const rowidx = row;
      const free_cellidx = Cell_get_free_cell();
   
      if(free_cellidx !== INT_NULL){
            
         const mesh = _cells_buffer.buffer[free_cellidx];
         
         mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         
         token.AddCell(free_cellidx, colidx, rowidx);
         
         if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx);
         token.AddCell(cell.idx, colidx, rowidx);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 1;
      const rowidx = row+1;
      const free_cellidx = Cell_get_free_cell();
   
      if(free_cellidx !== INT_NULL){
            
         const mesh = _cells_buffer.buffer[free_cellidx];
         
         mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         
         token.AddCell(free_cellidx, colidx, rowidx);
         
         if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx);
         token.AddCell(cell.idx, colidx, rowidx);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 2;
      const rowidx = row+1;
      const free_cellidx = Cell_get_free_cell();
   
      if(free_cellidx !== INT_NULL){
            
         const mesh = _cells_buffer.buffer[free_cellidx];
         
         mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         
         token.AddCell(free_cellidx, colidx, rowidx);
         
         if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx);
         token.AddCell(cell.idx, colidx, rowidx);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }

}
function Tetris_create_token_square(section, token){

   {
      const colidx = 1;
      const rowidx = TOP_ROW;
      const free_cellidx = Cell_get_free_cell();
   
      if(free_cellidx !== INT_NULL){
            
         const mesh = _cells_buffer.buffer[free_cellidx];
         
         mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         
         token.AddCell(free_cellidx, colidx, rowidx);
         
         if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx);
         token.AddCell(cell.idx, colidx, rowidx);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 1;
      const rowidx = TOP_ROW+1;
      const free_cellidx = Cell_get_free_cell();
   
      if(free_cellidx !== INT_NULL){
            
         const mesh = _cells_buffer.buffer[free_cellidx];
         
         mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         
         token.AddCell(free_cellidx, colidx, rowidx);
         
         if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx);
         token.AddCell(cell.idx, colidx, rowidx);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 2;
      const rowidx = TOP_ROW+1;
      const free_cellidx = Cell_get_free_cell();
   
      if(free_cellidx !== INT_NULL){
            
         const mesh = _cells_buffer.buffer[free_cellidx];
         
         mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         
         token.AddCell(free_cellidx, colidx, rowidx);
         
         if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx);
         token.AddCell(cell.idx, colidx, rowidx);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 2;
      const rowidx = TOP_ROW;
      const free_cellidx = Cell_get_free_cell();
   
      if(free_cellidx !== INT_NULL){
            
         const mesh = _cells_buffer.buffer[free_cellidx];
         
         mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         
         token.AddCell(free_cellidx, colidx, rowidx);
         
         if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx);
         token.AddCell(cell.idx, colidx, rowidx);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
}
function Tetris_create_token_shape_L(section, token){

   const row = TOP_ROW;
   {
      const colidx = 2;
      const rowidx = row;
      const free_cellidx = Cell_get_free_cell();
   
      if(free_cellidx !== INT_NULL){
            
         const mesh = _cells_buffer.buffer[free_cellidx];
         
         mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         
         token.AddCell(free_cellidx, colidx, rowidx);
         
         if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx);
         token.AddCell(cell.idx, colidx, rowidx);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 2;
      const rowidx = row+1;
      const free_cellidx = Cell_get_free_cell();
   
      if(free_cellidx !== INT_NULL){
            
         const mesh = _cells_buffer.buffer[free_cellidx];
         
         mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         
         token.AddCell(free_cellidx, colidx, rowidx);
         
         if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx);
         token.AddCell(cell.idx, colidx, rowidx);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 2;
      const rowidx = row+2;
      const free_cellidx = Cell_get_free_cell();
   
      if(free_cellidx !== INT_NULL){
            
         const mesh = _cells_buffer.buffer[free_cellidx];
         
         mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         
         token.AddCell(free_cellidx, colidx, rowidx);
         
         if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx);
         token.AddCell(cell.idx, colidx, rowidx);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 3;
      const rowidx = row+2;
      const free_cellidx = Cell_get_free_cell();
   
      if(free_cellidx !== INT_NULL){
            
         const mesh = _cells_buffer.buffer[free_cellidx];
         
         mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         
         token.AddCell(free_cellidx, colidx, rowidx);
         
         if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx);
         token.AddCell(cell.idx, colidx, rowidx);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
}
function Tetris_create_token_line2(section, token){

   {
      const colidx = 1;
      const rowidx = TOP_ROW;
      const free_cellidx = Cell_get_free_cell();
   
      if(free_cellidx !== INT_NULL){
            
         const mesh = _cells_buffer.buffer[free_cellidx];
         
         mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         
         token.AddCell(free_cellidx, colidx, rowidx);
         
         if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx);
         token.AddCell(cell.idx, colidx, rowidx);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 1;
      const rowidx = TOP_ROW+1;
      const free_cellidx = Cell_get_free_cell();
   
      if(free_cellidx !== INT_NULL){
            
         const mesh = _cells_buffer.buffer[free_cellidx];
         
         mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         
         token.AddCell(free_cellidx, colidx, rowidx);
         
         if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx);
         token.AddCell(cell.idx, colidx, rowidx);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
}
function Tetris_create_token_line4(section, token){

   {
      const colidx = 1;
      const rowidx = TOP_ROW;
      const free_cellidx = Cell_get_free_cell();
   
      if(free_cellidx !== INT_NULL){
            
         const mesh = _cells_buffer.buffer[free_cellidx];
         
         mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         
         token.AddCell(free_cellidx, colidx, rowidx);
         
         if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx);
         token.AddCell(cell.idx, colidx, rowidx);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 1;
      const rowidx = TOP_ROW+1;
      const free_cellidx = Cell_get_free_cell();
   
      if(free_cellidx !== INT_NULL){
            
         const mesh = _cells_buffer.buffer[free_cellidx];
         
         mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         
         token.AddCell(free_cellidx, colidx, rowidx);
         
         if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx);
         token.AddCell(cell.idx, colidx, rowidx);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 1;
      const rowidx = TOP_ROW+2;
      const free_cellidx = Cell_get_free_cell();
   
      if(free_cellidx !== INT_NULL){
            
         const mesh = _cells_buffer.buffer[free_cellidx];
         
         mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         
         token.AddCell(free_cellidx, colidx, rowidx);
         
         if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx);
         token.AddCell(cell.idx, colidx, rowidx);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 1;
      const rowidx = TOP_ROW+3;
      const free_cellidx = Cell_get_free_cell();
   
      if(free_cellidx !== INT_NULL){
            
         const mesh = _cells_buffer.buffer[free_cellidx];
         
         mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         
         token.AddCell(free_cellidx, colidx, rowidx);
         
         if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx);
         token.AddCell(cell.idx, colidx, rowidx);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
}

function Tetris_create_token(token_id, section) {
   
   const token = curr_token;
   token.Reset();

   // Tetris_create_token_test(section, token);
   Tetris_create_token_shape_L(section, token);
   // Tetris_create_token_square(section, token);
   // Tetris_create_token_line2(section, token);
   // Tetris_create_token_line4(section, token);
   
   curr_token = token;
   speed = def_speed;

   // console.log(
   //    '----------------------------------------------------------------------------------\nToken created',
   //    'cols', token.cols,
   //    'rows', token.rows,
   //    '\n----------------------------------------------------------------------------------',
   // )

}



export function Tetris(root_widget=0x0, x, y){

   /*************************************************************************************************/
   // Create the columns to store any
   Tetris_initialize_grid();



   const section = Create_widget_section(root_widget, _, [10, 10], [x,y,0], [TETRIS_PANEL_WIDTH+tetris_panel_pad, TETRIS_PANEL_HEIGHT+tetris_panel_pad], GREY[0], 'TetrisSection');
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 20);



   /*************************************************************************************************/
   // Create token

   const token = new Token();

   const row = TOP_ROW;
   const col = 2;
   {
      const colidx = col;
      const rowidx = row;
      const cell = Cell_create(colidx, TOP_ROW-rowidx, REDL[9]);
      token.AddCell(cell.idx, colidx, rowidx);
      section.AddItem(cell.mesh);
      curr_token = token;
   }
   {
      const colidx = col;
      const rowidx = row+1;
      const cell = Cell_create(colidx, TOP_ROW-rowidx, GREEN[9]);
      token.AddCell(cell.idx, colidx, rowidx);
      section.AddItem(cell.mesh);
      curr_token = token;
   }
   {
      const colidx = col;
      const rowidx = row+2;
      const cell = Cell_create(colidx, TOP_ROW-rowidx);
      token.AddCell(cell.idx, colidx, rowidx);
      section.AddItem(cell.mesh);
   }
   {
      const colidx = col+1;
      const rowidx = row+2;
      const cell = Cell_create(colidx, TOP_ROW-rowidx);
      token.AddCell(cell.idx, colidx, rowidx);
      section.AddItem(cell.mesh);
   }
      
      
   curr_token = token;
   
   console.log(
      '----------------------------------------------------------------------------------\nToken created',
      'cols', token.cols,
      'rows', token.rows,
      '\n----------------------------------------------------------------------------------',
   )



   /*************************************************************************************************/
   // Render Section 
   section.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
   section.GenGfxCtx();
   section.Render();


   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   Construct_listen_events_from_mesh_tree(section);
   Construct_listen_events_relations_from_mesh_tree(section);

   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);


   /*************************************************************************************************/
   // Create move for body meshes
   const params = {
      section: section,
   }
   
   Time_intervals_create(14, 'Tetris', TIME_INTERVAL_REPEAT_ALWAYS, Tetris_game_loop, params);


   // Bind Keyboard Controls
   Input_keyboard_bind_keydown_callback(Keyboard_input_keydown);
   Input_keyboard_bind_keyup_callback(Keyboard_input_keyup);
}
function Tetris_game_loop(params) {

   if(abort || in_remove_row_animation) return;
   
   const section = params.params.section;

   const section_bot = section.geom.pos[1] + section.geom.dim[1]*2 - tetris_panel_pad;

   const token = curr_token;
   
   const movey = speed;
   
   let has_collide = false;
   
   
   /*********************************************************************************/
   // Token mesh with grid bottom collision
   if(token.lower_row_idx <= 0 ) {
      
      // Set cell's token_mesh to the correct ypos, if the move function moved it pass the grid lower limit
      // const dif = section_bot-(token_mesh_bot-movey);
      const dif = -movey;
      token.AddPosY(dif);
      
      has_collide = true;

      // Create pound animation
      // Create_pound_animation(token, section_bot- _cells_buffer.buffer[token.cells.buffer[i]].geom.dim[1]);
   }
   else{

      for(let i=0; i<token.num_cells; i++){
         
         const token_mesh = _cells_buffer.buffer[token.cells.buffer[i]];
         const token_mesh_bot = movey + (token_mesh.geom.pos[1] + token_mesh.geom.dim[1]*2);
   
         /*********************************************************************************/
         // Check collision with other tokens
   
         // The column index taken from the token's cols buffer
         const col_idx = token.cols[i];
         
         if(_grid_columns.buffer[col_idx]===_)
            console.error('11223344112233 grid: wrong column index', 'col_idx', col_idx, '_grid_columns.buffer', _grid_columns.buffer)


         const any_active = _grid_columns.buffer[col_idx].active_count;
         if(any_active > 0) {
            
            const col_last_elem = _grid_columns.buffer[col_idx].boundary;
            const grid_cellidx = _grid_columns.buffer[col_idx].buffer[col_last_elem];
   
            if(grid_cellidx !== INT_NULL) {
   
               const grid_cell_token_mesh = _cells_buffer.buffer[grid_cellidx];
      
               const grid_cell_top = movey + (grid_cell_token_mesh.geom.pos[1]);
      
               if(token_mesh_bot > grid_cell_top) {
      
                  const dif = grid_cell_top-token_mesh_bot;
                  // const dif = -movey;
                  token.AddPosY(dif);
                  has_collide = true;
      
                  // Create pound animation
                  // Create_pound_animation(token, token_mesh.geom.pos[1]+token_mesh.geom.dim[1]);
      
                  break;
         
               }
            }
         }
      }
   }
   




   /*******************************************************************************/
   // Resolve Collision
   if(!has_collide) {
      if(DEBUG_NOT_MOVE_DOWN) return;
         token.MoveDown(movey);
   }
   // Else it has collide...
   else if(has_collide) {

      // END the game
      if(tetris_end) {
         // abort = true;
         return;
      }


      Grid_add_cells_from_token(token);

      if(DEBUG_PRINT){
         console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$\nAfter token is added to grid')   
         Debug_print()
      }
         
      
      // Store tokens rows that have a cell, for the check_row_compleyion before token reset 
      const token_cells_rows = [];
      for(let k=0; k<token.rows.length; k++){

         if(token.rows[k] !== INT_NULL){

            // Add only unique rows, starting from index 1 ofcourse
            if(k > 0){
               const exists = Gen_array_check_for_existing_element(token_cells_rows, token.rows[k])
               if(!exists) token_cells_rows.push(token.rows[k]);
            }
            else token_cells_rows.push(token.rows[k]);
         }
      }

      console.log('Checking row completion from rows buffer:', token.rows)
         
      Tetris_create_token(TETRIS_TOKEN_IDS.LINE, section);
         
      Grid_check_row_completion(token_cells_rows)
   }

   

   new_pos_x = 0;
   new_pos_y = 0;

}














/******************************************************************************************************************************/
// Animations

// Pound Animation
function Create_pound_animation(token, target_posy) {
   
   // store all cell's meshes, because the token will have been changed by the time the animation callback will execute

   let complete_rows_cell_idxs = [];
   for(let i=0; i<=token.cells.boundary; i++){
      if(token.cells.buffer[i] !== INT_NULL)
         complete_rows_cell_idxs.push(token.cells.buffer[i]);
   }

   const params = {
      complete_rows_cell_idxs: complete_rows_cell_idxs,
      target_posy:target_posy,
      posy_limit:3,
      anim_dir:-1, // animation's direction
      thershold:2, // The threshold of the least posy_limit value in pixels to exit animation
   };

   Callback_animations_create(Animation_pound_run, Animation_pound_stop, params);
}
function Animation_pound_run(params) {

   const complete_rows_cell_idxs = params.complete_rows_cell_idxs;
   const anim_dir = params.anim_dir;
   const thershold = params.thershold;

   const y = 1 * anim_dir;

   const len = complete_rows_cell_idxs.length;
   for(let i=0; i<len; i++){
      const mesh = _cells_buffer.buffer[complete_rows_cell_idxs[i]];
      mesh.geom.pos[1] += y;
      Gl_add_wpos_y(mesh.gfx, y, 1);
   }

   params.posy_limit *= .9;
   // Stop animation when a certain threshold has been reached
   if(params.posy_limit < thershold) 
      return false
   
   return true;

}
function Animation_pound_stop(params) {

   const complete_rows_cell_idxs = params.complete_rows_cell_idxs;
   const target_posy = params.target_posy;

   const len = complete_rows_cell_idxs.length;
   for(let i=0; i<len; i++){
      const mesh = _cells_buffer.buffer[complete_rows_cell_idxs[i]];
      mesh.geom.pos[1] = target_posy;
      Gl_set_wpos_y(mesh.gfx, target_posy, 1);
   }

   return false;
}


// Remove Row Animation

function Create_row_animation(complete_rows_cell_idxs, rowidxs) {
   
   // Create scale animation
   const params = {
      complete_rows_cell_idxs: complete_rows_cell_idxs,
      all_rgb_maxed:0x0,
      rowidxs:rowidxs,
   };

   in_remove_row_animation = true;

   Callback_animations_create(Animation_row_run, Animation_row_stop, params);
}
function Animation_row_run(params) {

   // !! Runs for all tokens of a row, so 1 callback_animation that will call remove row once.

   const complete_rows_cell_idxs = params.complete_rows_cell_idxs;
   const c = .02;
   let stop_anim = false;

   const len = complete_rows_cell_idxs.length;
   for(let i=0; i<len; i++){
      
      const mesh = _cells_buffer.buffer[complete_rows_cell_idxs[i]];

      let r = mesh.mat.col[0];
      let g = mesh.mat.col[1];
      let b = mesh.mat.col[2];
      
      if(r <= 1.0) r += c;
      else params.all_rgb_maxed |= 0x1;
      if(g <= 1.0) g += c;
      else params.all_rgb_maxed |= 0x2;
      if(b <= 1.0) b += c;
      else params.all_rgb_maxed |= 0x4;
      
      mesh.mat.col[0] = r;
      mesh.mat.col[1] = g;
      mesh.mat.col[2] = b;

      // Check the minimum rgb to reach 1 in order to stop the animation
      const min = Min3(r, g, b);
      if(min>=1.0) stop_anim = true;

      Gl_set_rgb(mesh.gfx, mesh.mat.col, 1);

   }

   // Stop animation when a certain threshold has been reached
   if(stop_anim) 
      return false


   return true;

}
function Animation_row_stop(params) {

   const complete_rows_cell_idxs = params.complete_rows_cell_idxs;

   const params2 = {
      complete_rows_cell_idxs: complete_rows_cell_idxs,
      move_amt:100,
      thershold:1,
      rowidxs:params.rowidxs,
   }

   // Create disperse tokens animation
   Callback_animations_create(Animation_row_destroy_run, Animation_row_destroy_stop, params2);

   return false;
}
function Animation_row_destroy_run(params) {

   const complete_rows_cell_idxs = params.complete_rows_cell_idxs;
   const move_amt = params.move_amt;
   const thershold = params.thershold;

   const y = 1 * move_amt;

   const len = complete_rows_cell_idxs.length;
   for(let i=0; i<len; i++){
      
      const mesh = _cells_buffer.buffer[complete_rows_cell_idxs[i]];
      mesh.geom.pos[1] += y;
      Gl_add_wpos_y(mesh.gfx, y, 1);
      // console.log(complete_rows_cell_idxs[i])
   }

   params.move_amt *= .8;
   // Stop animation when a certain threshold has been reached
   if(params.move_amt < thershold) 
      return false


   return true;

}
function Animation_row_destroy_stop(params) {

   const rowidxs = params.rowidxs;
   const boundary = rowidxs.length-1;

   for(let i=boundary; i>=0; i--){

      console.log('Removing Row:', rowidxs[i])
      Grid_remove_row(rowidxs[i]);
      
      // if(DEBUG_PRINT){
      //    console.log('#############################################################################################\nAfter grid row has been removed')   
      //    Debug_print()
      // }
      
      const y = ROW_HEIGHT;
      Grid_move_all_down(y, rowidxs[i]);
   }

   if(DEBUG_PRINT){
      console.log('#############################################################################################\nAfter grid row has been removed')   
      Debug_print()
   }

   in_remove_row_animation = false;
   complete_rows_cell_idxs = [];
   complete_rows_idxs = [];

   return false;
}































function Debug_print(){
   console.log('------------------------------------------------------------------------------------',)   

   for(let i=0; i<=_grid_columns.boundary; i++){
      
      console.log(      
         'active', _grid_columns.buffer[i].active_count,
         'boundary', _grid_columns.buffer[i].boundary,
         'size', _grid_columns.buffer[i].size,
         _grid_columns.buffer[i].buffer
      )
   }
   console.log(
      'Token:',
      'cols', curr_token.cols,
      'rows', curr_token.rows,
   )

}