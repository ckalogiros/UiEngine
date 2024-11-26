"use strict";

import { Callback_animations_create } from "../../../../Engine/Animations/CallbackAnimations.js";
import { Input_keyboard_bind_keydown_callback, Input_keyboard_bind_keyup_callback } from "../../../../Engine/Controls/Input/Keyboard.js";
import { New_generic_buffer, New_int16_buffer } from "../../../../Engine/Core/Buffers.js";
import { Create_widget_section } from "../../../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../../../Engine/Core/Views/RootView.js";
import { BLUEL, GREEN, GREY, ORANGEL, ORANGER, PURPLE, PURPLEB, REDL, YELLOW } from "../../../../Engine/Drawables/Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../../../Engine/Drawables/Operations/Recursions.js";
import { Time_intervals_create, Time_intervals_destroy, Time_intervals_destroy_byidx, Time_intervals_reset_byidx } from "../../../../Engine/Timers/TimeIntervals.js";
import { Gl_add_dim_xy, Gl_add_wpos_xy, Gl_add_wpos_y, Gl_set_attr_round_corners, Gl_set_dim_xy, Gl_set_dim_y, Gl_set_rgb, Gl_set_wpos_x, Gl_set_wpos_xy, Gl_set_wpos_y } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { Gen_array_check_for_existing_element } from "../../../../Helpers/GenericFunctions.js";
import { Function_Slope, Logarithmic_interpolation } from "../../../../Helpers/Math/MathFunctions.js";
import { Abs, Floor, Fract, Min3 } from "../../../../Helpers/Math/MathOperations.js";




const DEBUG_PRINT = true;
const DEBUG_PRINT2 = false;
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


const TETRIS_TOKENS_COLORS = {
   RECT: BLUEL[9],
   L: PURPLE[9],
   L_MIRROR: YELLOW[9],
   LINE: GREEN[9],
};


const GRID = {
   top_row:0
};

const MAX_COLUMNS = 8;
const TOKEN_SIZE = 30;
const MAX_TOKENS_IN_Y_AXIS = 12;
const TOP_ROW = MAX_TOKENS_IN_Y_AXIS-1;
const ROW_HEIGHT = TOKEN_SIZE*2;
const COL_WIDTH = TOKEN_SIZE*2;
const TETRIS_PANEL_HEIGHT = MAX_TOKENS_IN_Y_AXIS*TOKEN_SIZE;
const TETRIS_PANEL_WIDTH = TOKEN_SIZE*MAX_COLUMNS;
const tetris_panel_pad = 10;
let speed = .5;
const def_speed = speed;
const cell_round_corners = TOKEN_SIZE/2;

// Indexes to a specific token's pivots
const ROTATION_STATES = {
   UP:0,
   RIGHT:1,
   DOWN:2,
   LEFT:3,
};

const TOKEN_TYPE = {
   RECT:0,
   LINE:1,
   L:2,
   L_MIRRORED:3,
};

/**
 * Predetermined
 * Cell indexes of a token's cell pivot
 * 
 * Example:
 * Token: Line [1, 2, 2, 0]
 * 1 is the second cell of the line token.
 * 1 is at index 0, which means is addressing the rotation state of 'ROTATION_STATES.UP'.
 * In conclusion, for a line token, in the rotation state 'UP', the pivot is the cell with index 1. 
 *    
 */
const _token_rotation_states_pivots = [
   [3, 3, 3, 3], // Rotation state: Rect
   [2, 2, 2, 2], // Rotation state: Line
   [3, 3, 3, 3], // Rotation state: L
   [0, 0, 0, 0], // Rotation state: L_mirrored
];

function DEBUG_rotations_state(rotation_state) {
   if(rotation_state===0) return 'UP';
   if(rotation_state===1) return 'RIGHT';
   if(rotation_state===2) return 'DOWN';
   if(rotation_state===3) return 'LEFT';
   alert('991544444444')
}





const init_slope = .14;


let in_remove_row_animation = false;
let tetris_end = false;
let game_loop_time_interval_idx = INT_NULL;

// TODO: create Int16 buffers, to easily reset/reuse them
let complete_rows_cell_idxs = [];
let complete_rows_idxs = [];

const grid_top_cells_row_idxs = new Int16Array(MAX_COLUMNS);



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
// Mesh-Cell Properties Class
class Cell_mesh_properties {

   constructor(_mesh = null, glow_intensity = 1) {

      if (!_mesh) alert('000000000012')

      this.mesh = _mesh;
      this.idx = INT_NULL;
      this.size = TOKEN_SIZE;
      
      // A modifier for the calculation of the slope function that controls the next position 
      this.time = 0; // Values = [0-1]
      this.time_step = 0.014; // Values = [0-1]
      this.prev_slope_val = 0;// Stores the current calculated 'time' to be used on the next 'Move' calculation. 
      
      this.next_anim_start = .3; // The slope's value at which the next cell animation should start
      
      this.in_animation = false;
      
      this.glow_intensity = glow_intensity;

      this.scale = 20;
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

      // Initialize grids top cells row indexes
      grid_top_cells_row_idxs[i] = INT_NULL;
   }

}
function Grid_get_colidx_from_posx(xpos) {

   const x = xpos - tetris_panel_pad - TOKEN_SIZE;
   const col_idx = (x!==0) ? x / COL_WIDTH : 0;
   
   if(DEBUG_PRINT2) if(Fract(col_idx))
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
      _grid_columns.buffer[i].buffer[row_idx] = INT_NULL;
      _grid_columns.buffer[i].active_count--;

   }
   
}
function TEMP_recalc_boundary(){
   // Recalc the boundary
   for(let i=0; i<MAX_COLUMNS; i++){
      _grid_columns.buffer[i].boundary = INT_NULL; 
      const start = _grid_columns.buffer[i].size-1;
      for(let j=start; j>=0; j--){
         if(_grid_columns.buffer[i].buffer[j] !== INT_NULL) { 
            _grid_columns.buffer[i].boundary = j; 
            break; 
         }
      } 
   }
}
function TEMP_find_max_val_from_arr(arr){
   
   let max = arr[0];
   const len = arr.length;

   for(let i=1; i<len; i++){
      if(arr[i] > max)
         max = arr[i];
   }

   return max;
}
function TEMP_find_min_val_from_arr(arr){
   
   let min = arr[0];
   const len = arr.length;

   for(let i=1; i<len; i++){
      if(arr[i] !== INT_NULL && arr[i] < min)
         min = arr[i];
   }

   return max;
}
function Grid_move_all_down(row_idxs) {
   
   const num_rows = row_idxs.length;
   
   let move_rows = 0;
   let removed_cnt = 0;

   // for(let i=0; i<MAX_TOKENS_IN_Y_AXIS; i++){
   for(let i=0; i<=GRID.top_row; i++){
      
      if(row_idxs[removed_cnt] === i && removed_cnt < num_rows) {

         move_rows++;
         removed_cnt++;
      }
      else if(move_rows > 0){

   
         for(let k=0; k < MAX_COLUMNS; k++){
            
            const cellidx = _grid_columns.buffer[k].buffer[i];
            let total_height = ROW_HEIGHT * num_rows;
            // let total_height = ROW_HEIGHT;
            if(cellidx !== INT_NULL) {
               const mesh = _cells_buffer.buffer[cellidx].mesh;
               mesh.geom.pos[1] += total_height;
               Gl_add_wpos_y(mesh.gfx, total_height, 1);
            }
            
            _grid_columns.buffer[k].buffer[i-move_rows] = _grid_columns.buffer[k].buffer[i];
            _grid_columns.buffer[k].buffer[i] = INT_NULL;
         }
      }
   }

   TEMP_recalc_boundary();

   GRID.top_row -= move_rows;

}
function Grid_add_cells_from_token(token){

   if(DEBUG_PRINT2) console.log('ADDING TOKEN:', 'token.cols[i]', token.cols, 'token.rows[i]', token.rows);
   for(let i=0; i<token.num_cells; i++) {

      const cellidx = token.cells.buffer[i];
      // const mesh = _cells_buffer.buffer[cellidx].mesh;
      const col_idx = token.cols[i];
      const row_idx = token.rows[i];
      if(DEBUG_PRINT2) console.log('i:', i, 'col_idx', col_idx, 'row_idx', row_idx, 'cellidx', cellidx);


      if(row_idx >= MAX_TOKENS_IN_Y_AXIS) 
         tetris_end = true;
   
      _grid_columns.buffer[col_idx].AddAtIndex(row_idx, cellidx);

      // Store any cell that is higher
      // TODO: If token's cells are sorted from left to right, bottom to top, then we need not to check if cur token cell is greater than the previous stored
      if(row_idx > grid_top_cells_row_idxs[col_idx]){
         grid_top_cells_row_idxs[col_idx] = row_idx;
      }

      
      if(GRID.top_row < row_idx)  GRID.top_row = row_idx;

   }

}
function Grid_check_row_completion(token_cells_rows) {

   if(in_remove_row_animation) return;

   if(DEBUG_PRINT) console.log('---- CHECKING ROWS ----')

   let complete_rows_cnt = 0; // A row counter to run for all completed rows
   
   const len = token_cells_rows.length;
   let is_row_complete = false;
   
   let rowidx = INT_NULL;
   for(let j=0; j<len; j++){
      
      let cell_cnt = 0;

      // Avoid repeat same rows, by checking the prev row(Row indexes MUST be sorted) 
      
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
      if(DEBUG_PRINT) console.log('@#$@#$ @#$@#$ @#$@#$ @#$@#$ @#$@#$ @#$@#$');
      if(DEBUG_PRINT) console.log('complete_rows_cell_idxs', complete_rows_cell_idxs, 'complete_rows_idxs', complete_rows_idxs);
      Create_row_animation(complete_rows_cell_idxs, complete_rows_idxs);
   }
}













/*********************************************************************************************************/
// Cell functions
function Cell_create(offsetx=0, offsety=0, col){

   const color = col!==undefined ? col : YELLOW[9];
   const mesh = Create_widget_section(_, _, [0, 0], [10+(TOKEN_SIZE*2*offsetx), 10+(TOKEN_SIZE*2*offsety),0], [TOKEN_SIZE, TOKEN_SIZE], color, 'mesh');
   mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, cell_round_corners);

   const cell = new Cell_mesh_properties(mesh);

   if(DEBUG_PRINT2) console.log('CREATING NEW CELL', cell)
   
   const cellidx = _cells_buffer.Add(cell);

   return {
      mesh:mesh,
      idx:cellidx,
   };
}
function Cell_store_free_cell(cellidx) {
   _free_cells_buffer.Add(cellidx);
   if(DEBUG_PRINT2) console.log('FREE CELL STORE:', cellidx, _cells_buffer.buffer[cellidx])
}
function Cell_get_free_cell() {

   const last_elem = _free_cells_buffer.boundary;
   if(last_elem >= 0) {

      const free_cell_idx = _free_cells_buffer.buffer[last_elem];
      _free_cells_buffer.RemoveByIdxSortedVersionLastElemGuarantee();
      if(DEBUG_PRINT2) console.log('USED CELL FOUND. free_cell_idx:', free_cell_idx, 'cell',  _cells_buffer.buffer[free_cell_idx])
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
   [ 0, 1],
   [-1, 0]
];
const mat_rot_90_counterclockwise = [
   [0, -1],
   [1,  0]
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
const temp_pivot = 1
class Token {
   
   constructor(rotation_state){
      
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

      this.pivot_cell_idx = 0;

      this.rotation_state = ROTATION_STATES.UP;

      this.recurse_cnt = 0; // Count recursive calls
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
   AddCell(cellidx, colidx, rowidx, is_pivot=false, token_type=TOKEN_TYPE.LINE, rotation_state=ROTATION_STATES.UP){

      this.cells.Add(cellidx);

      this.cols[this.num_cells] = colidx; // Put tokens rect to 0-th column
      this.rows[this.num_cells] = rowidx; // Put tokens rect to top row
      
      if((colidx > this.right_most_col)) this.right_most_col = colidx
      if((colidx < this.left_most_col) || this.left_most_col===INT_NULL) this.left_most_col = colidx

      if(is_pivot) this.pivot_cell_idx = cellidx;

      this.rotation_state = rotation_state;
      this.token_type = token_type;

      this.num_cells++;

   }
   RotateLeft(){

      // Pivot cell for center of rotation
      let pivot = _token_rotation_states_pivots[this.token_type][this.rotation_state];
      
      if(DEBUG_PRINT2) console.log('this.right_most_col', this.right_most_col);

      if(this.left_most_col <= 2) {
         if(this.cols[0] > 0)
            pivot = 2;
         else pivot = 1
      }

      const px = this.cols[pivot], py = this.rows[pivot];


      let needs_moving_left = false, needs_moving_right = false;
      let move_cols = 0;
      for(let i = 0; i < this.num_cells; i++) {

         const res = Mat2_mult_vec2(mat_rot_90_counterclockwise, this.cols[i]-px, this.rows[i]-py);

         const new_col = res[0]+px;
         const new_row = res[1]+py;

         // Case the rotating token is out of boundaries
         if((new_col < 0) && (move_cols < Abs(new_col))) {
            needs_moving_right = true;
            move_cols = Abs(new_col);
         }
         if((new_col >= MAX_COLUMNS-1) && (move_cols < new_col - (MAX_COLUMNS-1))) {
            needs_moving_left = true;
            move_cols = new_col - (MAX_COLUMNS-1);
         }
         
         this.cols[i] = new_col;
         this.rows[i] = new_row;

      }

      if(needs_moving_left) 
         this.MoveLeft(move_cols);
      if(needs_moving_right) 
         this.MoveRight(move_cols);

      this.left_most_col = Token_get_left_most_col(this.cols);
      this.right_most_col = Token_get_right_most_col(this.cols);
      this.lower_row_idx = Token_get_lower_most_row(this.rows);

      this.rotation_state--;
      if(this.rotation_state < 0) this.rotation_state = 3;

   }
   RotateRight(){

      // Pivot (x,y)
      let pivot = _token_rotation_states_pivots[this.token_type][this.rotation_state];

      if(DEBUG_PRINT2) console.log('this.right_most_col', this.right_most_col);

      if(this.left_most_col === 0) pivot = 1;
      if(this.right_most_col === 0) pivot = 2;


      const px = this.cols[pivot], py = this.rows[pivot];
      let needs_moving_left = false, needs_moving_right = false;
      let move_cols = 0;
      for(let i = 0; i < this.num_cells; i++) {

         const res = Mat2_mult_vec2(mat_rot_90_clockwise, this.cols[i]-px, this.rows[i]-py);

         const new_col = res[0]+px;
         const new_row = res[1]+py;
         
         // Case the rotaing token is out of boundaries
         if((new_col < 0) && (move_cols < Abs(new_col))) {

            needs_moving_right = true;
            move_cols = Abs(new_col);
         }
         if((new_col >= MAX_COLUMNS-1) && (move_cols <  new_col - (MAX_COLUMNS-1))) {
            needs_moving_left = true;
            move_cols = new_col - (MAX_COLUMNS-1);
         }
         
         this.cols[i] = new_col;
         this.rows[i] = new_row;
         
      }
      
      if(needs_moving_left) this.MoveLeft(move_cols);
      if(needs_moving_right) this.MoveRight(move_cols);

      this.left_most_col = Token_get_left_most_col(this.cols);
      this.right_most_col = Token_get_right_most_col(this.cols);
      this.lower_row_idx = Token_get_lower_most_row(this.rows);

      this.rotation_state++;
      if(this.rotation_state > 3) this.rotation_state = 0;

      
      // const grid_col = _grid_columns.buffer[this.left_most_col];
      // const grid_row = grid_col.buffer[this.lower_row_idx];

      // if(grid_row !== INT_NULL) {

      //    console.error('HIT!!');
      //    if(this.recurse_cnt <= 3) {
      //       this.recurse_cnt++;
      //       this.RotateRight();
      //    }
      // }

      // this.recurse_cnt = 0;
      // // console.log( '\nthis.left_most_col', this.left_most_col, 'this.right_most_col', this.right_most_col,)
   }
   MoveLeft(move_cols=1){

      const col_idx = this.left_most_col;
      if(col_idx > 0){

         // Check collisions with other grid cells
         for (let i=0; i<4; i++) {
            
            const colidx = this.cols[i]-move_cols; // Hypotheticaly move to the left
            if(_grid_columns.buffer[colidx].boundary !== INT_NULL) { // If the grid column has any cell
            
               const rowidx = this.rows[i];
               if(rowidx < MAX_TOKENS_IN_Y_AXIS) { // Avoid ending the game if token is at top and beyond

                   // If the grid cell exists at the hypothetical moved token cell position... don't move
                  if(_grid_columns.buffer[colidx].buffer[rowidx] !== INT_NULL) {
                     return;
                  }
               }
            }
         }

         // Move token cells
         this.cols[0]-=move_cols;
         this.cols[1]-=move_cols;
         this.cols[2]-=move_cols;
         this.cols[3]-=move_cols;

         this.right_most_col-=move_cols; // If we moved to the right, then increment the right most token's column index
         this.left_most_col-=move_cols; // If we moved to the right, then increment the left most token's column index
      }

   }
   MoveRight(move_cols=1){

      const col_idx = this.right_most_col;
      if(col_idx < MAX_COLUMNS-1){

         // Check collisions with other grid cells
         for (let i=0; i<4; i++) {
            
            const colidx = this.cols[i]+move_cols; // Hypotheticaly move to the right
            if(_grid_columns.buffer[colidx].boundary !== INT_NULL) { // If the grid column has any cell
            
               const rowidx = this.rows[i];
               if(rowidx < MAX_TOKENS_IN_Y_AXIS) { // Avoid ending the game if token is at top and beyond

                  // If the grid cell exists at the hypothetical moved token cell position... don't move
                  if(_grid_columns.buffer[colidx].buffer[rowidx] !== INT_NULL) { 
                     return;
                  }
               }
            }
         }

         // Move token cells
         if(this.num_cells < 3) alert('009989098 token should have 4 cells in this Move() implementation')
         this.cols[0]+=move_cols;
         this.cols[1]+=move_cols;
         this.cols[2]+=move_cols;
         this.cols[3]+=move_cols;

         this.right_most_col+=move_cols; // If we moved to the right, then increment the right most token's column index
         this.left_most_col+=move_cols; // If we moved to the right, then increment the left most token's column index
      }

   }
   MoveDown(move){

      this.dist += move;

      for(let i=0; i<this.num_cells; i++){
         
         // Decrement rows for each cell
         if(this.dist >= ROW_HEIGHT && this.rows[i] !== INT_NULL) {
            this.rows[i]--;
         }
      }

      // Advance lower row counter
      if(this.dist >= ROW_HEIGHT) {
         this.lower_row_idx--;
         this.dist = 0;
      }
   }
   UpdatePos(){

      for(let i=0; i<this.num_cells; i++){

         const xx = Grid_get_posx_from_colidx(this.cols[i]);
         const yy = Grid_get_posx_from_colidx(TOP_ROW-this.rows[i]);

         const mesh = _cells_buffer.buffer[this.cells.buffer[i]].mesh;
         mesh.geom.pos[1] = xx;
         mesh.geom.pos[1] = yy;
         Gl_set_wpos_xy(mesh.gfx, xx, yy, 1);
      }
   }
}


let curr_token = null;

function Cell_reset_mesh(mesh, colidx, rowidx){

   mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
   mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
   Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
   mesh.geom.dim[0] = TOKEN_SIZE;
   mesh.geom.dim[1] = TOKEN_SIZE;
   Gl_set_dim_xy(mesh.gfx, mesh.geom.dim[0], mesh.geom.dim[1]);

   mesh.geom.SetDimXY(mesh.gfx, TOKEN_SIZE, TOKEN_SIZE);
   
   mesh.mat.style.rcorners = cell_round_corners;
   Gl_set_attr_round_corners(mesh.gfx, mesh.mat.style.rcorners);
   
}

function Tetris_create_token_square(section, token){

   {
      const colidx = 1;
      const rowidx = TOP_ROW;
      const free_cellidx = Cell_get_free_cell();
   
      if(free_cellidx !== INT_NULL){
            
         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         Cell_reset_mesh(mesh, colidx, rowidx)
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.RECT, ROTATION_STATES.UP);
         mesh.SetColorRGB(TETRIS_TOKENS_COLORS.RECT);
         // if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         // else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx, TETRIS_TOKENS_COLORS.RECT);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.RECT, ROTATION_STATES.UP);
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
            
         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         Cell_reset_mesh(mesh, colidx, rowidx)
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.RECT, ROTATION_STATES.UP);
         mesh.SetColorRGB(TETRIS_TOKENS_COLORS.RECT);

         // if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         // else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx, TETRIS_TOKENS_COLORS.RECT);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.RECT, ROTATION_STATES.UP);
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
            
         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         Cell_reset_mesh(mesh, colidx, rowidx);
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.RECT, ROTATION_STATES.UP);
         
         mesh.SetColorRGB(TETRIS_TOKENS_COLORS.RECT);

         // if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         // else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx, TETRIS_TOKENS_COLORS.RECT);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.RECT, ROTATION_STATES.UP);
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
            
         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         Cell_reset_mesh(mesh, colidx, rowidx);
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.RECT, ROTATION_STATES.UP);
         
         mesh.SetColorRGB(TETRIS_TOKENS_COLORS.RECT);

         // if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         // else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx, TETRIS_TOKENS_COLORS.RECT);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.RECT, ROTATION_STATES.UP);
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
            
         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         
         // mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         // mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         // Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         Cell_reset_mesh(mesh, colidx, rowidx)
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.L, ROTATION_STATES.UP);
         
         mesh.SetColorRGB(TETRIS_TOKENS_COLORS.L);

         // if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         // else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx, TETRIS_TOKENS_COLORS.L);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.L, ROTATION_STATES.UP);
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
            
         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         
         // mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         // mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         // Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         Cell_reset_mesh(mesh, colidx, rowidx)
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.L, ROTATION_STATES.UP);
         
         mesh.SetColorRGB(TETRIS_TOKENS_COLORS.L);

         // if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         // else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx, TETRIS_TOKENS_COLORS.L);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.L, ROTATION_STATES.UP);
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
            
         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         
         // mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         // mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         // Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         Cell_reset_mesh(mesh, colidx, rowidx)
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.L, ROTATION_STATES.UP);
         
         mesh.SetColorRGB(TETRIS_TOKENS_COLORS.L);

         // if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         // else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx, TETRIS_TOKENS_COLORS.L);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.L, ROTATION_STATES.UP);
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
            
         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         
         // mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         // mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         // Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         Cell_reset_mesh(mesh, colidx, rowidx)
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.L, ROTATION_STATES.UP);
         
         mesh.SetColorRGB(TETRIS_TOKENS_COLORS.L);

         // if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         // else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx, TETRIS_TOKENS_COLORS.L);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.L, ROTATION_STATES.UP);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
}
function Tetris_create_token_shape_L_mirror(section, token){

   const row = TOP_ROW;
   {
      const colidx = 2;
      const rowidx = row;
      const free_cellidx = Cell_get_free_cell();
   
      if(free_cellidx !== INT_NULL){
            
         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         
         // mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         // mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         // Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         Cell_reset_mesh(mesh, colidx, rowidx)
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.L_MIRRORED, ROTATION_STATES.UP);
         
         mesh.SetColorRGB(TETRIS_TOKENS_COLORS.L_MIRROR);

         // if(free_cellidx.idx===6) mesh.SetColorRGB(TETRIS_TOKENS_COLORS.L_MIRROR);
         // else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx, TETRIS_TOKENS_COLORS.L_MIRROR);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.L_MIRRORED, ROTATION_STATES.UP);
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
            
         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         
         // mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         // mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         // Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         Cell_reset_mesh(mesh, colidx, rowidx)
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.L_MIRRORED, ROTATION_STATES.UP);
         
         mesh.SetColorRGB(TETRIS_TOKENS_COLORS.L_MIRROR);

         // if(free_cellidx.idx===6) mesh.SetColorRGB(TETRIS_TOKENS_COLORS.L_MIRROR);
         // else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx, TETRIS_TOKENS_COLORS.L_MIRROR);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.L_MIRRORED, ROTATION_STATES.UP);;
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
            
         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         
         // mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         // mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         // Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         Cell_reset_mesh(mesh, colidx, rowidx)
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.L_MIRRORED, ROTATION_STATES.UP);
         
         mesh.SetColorRGB(TETRIS_TOKENS_COLORS.L_MIRROR);

         // if(free_cellidx.idx===6) mesh.SetColorRGB(TETRIS_TOKENS_COLORS.L_MIRROR);
         // else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx, TETRIS_TOKENS_COLORS.L_MIRROR);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.L_MIRRORED, ROTATION_STATES.UP);;
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 1;
      const rowidx = row+2;
      const free_cellidx = Cell_get_free_cell();
   
      if(free_cellidx !== INT_NULL){
            
         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         
         // mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         // mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         // Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         Cell_reset_mesh(mesh, colidx, rowidx)
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.L_MIRRORED, ROTATION_STATES.UP);
         
         mesh.SetColorRGB(TETRIS_TOKENS_COLORS.L_MIRROR);

         // if(free_cellidx.idx===6) mesh.SetColorRGB(TETRIS_TOKENS_COLORS.L_MIRROR);
         // else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx, TETRIS_TOKENS_COLORS.L_MIRROR);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.L_MIRRORED, ROTATION_STATES.UP);;
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
            
         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         
         // mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         // mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         // Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         Cell_reset_mesh(mesh, colidx, rowidx)
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.LINE, ROTATION_STATES.UP);
         
         mesh.SetColorRGB(TETRIS_TOKENS_COLORS.LINE);

         // if(free_cellidx.idx===6) mesh.SetColorRGB(TETRIS_TOKENS_COLORS.LINE);
         // else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx, TETRIS_TOKENS_COLORS.LINE);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.LINE, ROTATION_STATES.UP);;
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
            
         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         
         // mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         // mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         // Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         Cell_reset_mesh(mesh, colidx, rowidx)
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.LINE, ROTATION_STATES.UP);
         
         mesh.SetColorRGB(TETRIS_TOKENS_COLORS.LINE);

         // if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         // else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx, TETRIS_TOKENS_COLORS.LINE);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.LINE, ROTATION_STATES.UP);;
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
            
         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         
         // mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         // mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         // Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         Cell_reset_mesh(mesh, colidx, rowidx);
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.LINE, ROTATION_STATES.UP);
         
         mesh.SetColorRGB(TETRIS_TOKENS_COLORS.LINE);

         // if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         // else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx, TETRIS_TOKENS_COLORS.LINE);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.LINE, ROTATION_STATES.UP);;
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
            
         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         
         // mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         // mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         // Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         Cell_reset_mesh(mesh, colidx, rowidx);
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.LINE, ROTATION_STATES.UP);
         
         mesh.SetColorRGB(TETRIS_TOKENS_COLORS.LINE);

         // if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         // else mesh.SetColorRGB(PURPLE[9]);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW-rowidx, TETRIS_TOKENS_COLORS.LINE);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.LINE, ROTATION_STATES.UP);;
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
}
function Tetris_create_token_test(section, token){


   const row = 4;
   {
      const colidx = 1;
      const rowidx = row;
      const free_cellidx = Cell_get_free_cell();
   
      if(free_cellidx !== INT_NULL){
            
         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         
         mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         
         token.AddCell(free_cellidx, colidx, rowidx);
         
         // if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         // else mesh.SetColorRGB(PURPLE[9]);
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
            
         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         
         mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         
         token.AddCell(free_cellidx, colidx, rowidx);
         
         // if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         // else mesh.SetColorRGB(PURPLE[9]);
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
            
         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         
         mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         
         token.AddCell(free_cellidx, colidx, rowidx);
         
         // if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         // else mesh.SetColorRGB(PURPLE[9]);
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
            
         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         
         mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         
         token.AddCell(free_cellidx, colidx, rowidx);
         
         // if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         // else mesh.SetColorRGB(PURPLE[9]);
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
            
         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         
         mesh.geom.pos[0] = 10+(TOKEN_SIZE*2*colidx);
         mesh.geom.pos[1] = 10+(TOKEN_SIZE*2*(TOP_ROW-rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+TOKEN_SIZE, mesh.geom.pos[1]+TOKEN_SIZE);
         
         token.AddCell(free_cellidx, colidx, rowidx);
         
         // if(free_cellidx.idx===6) mesh.SetColorRGB(REDL[9]);
         // else mesh.SetColorRGB(PURPLE[9]);
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

const token_cycle = [Tetris_create_token_line4, Tetris_create_token_shape_L_mirror, Tetris_create_token_shape_L, Tetris_create_token_square]
let cycle_cnt = 0;
function Tetris_create_token(token_id, section) {
   
   const token = curr_token;
   token.Reset();

   const Create_token = token_cycle[cycle_cnt];
   cycle_cnt++;
   if(cycle_cnt > 3) cycle_cnt = 0;
   Create_token(section, token)

   // Tetris_create_token_test(section, token);
   // Tetris_create_token_shape_L(section, token);
   // Tetris_create_token_square(section, token);
   // Tetris_create_token_line2(section, token);
   // Tetris_create_token_line4(section, token);
   
   curr_token = token;
   speed = def_speed;

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

   const row = DEBUG_NOT_MOVE_DOWN ? TOP_ROW/2 : TOP_ROW;
   const col = DEBUG_NOT_MOVE_DOWN ? MAX_COLUMNS/2 : 2;
   {
      const colidx = col;
      const rowidx = row;
      const cell = Cell_create(colidx, TOP_ROW-rowidx, TETRIS_TOKENS_COLORS.RECT);
      token.AddCell(cell.idx, colidx, rowidx);
      section.AddItem(cell.mesh);
      curr_token = token;
   }
   {
      const colidx = col;
      const rowidx = row+1;
      const cell = Cell_create(colidx, TOP_ROW-rowidx, TETRIS_TOKENS_COLORS.L);
      token.AddCell(cell.idx, colidx, rowidx);
      section.AddItem(cell.mesh);
      curr_token = token;
   }
   {
      const colidx = col;
      const rowidx = row+2;
      const cell = Cell_create(colidx, TOP_ROW-rowidx, TETRIS_TOKENS_COLORS.LINE);
      token.AddCell(cell.idx, colidx, rowidx);
      section.AddItem(cell.mesh);
   }
   // {
   //    const colidx = col+1;
   //    const rowidx = row+2;
   //    const cell = Cell_create(colidx, TOP_ROW-rowidx);
   //    token.AddCell(cell.idx, colidx, rowidx);
   //    section.AddItem(cell.mesh);
   // }
   {
      const colidx = col;
      const rowidx = row+3;
      const cell = Cell_create(colidx, TOP_ROW-rowidx, TETRIS_TOKENS_COLORS.L_MIRROR);
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
   
   game_loop_time_interval_idx = Time_intervals_create(14, 'Tetris', TIME_INTERVAL_REPEAT_ALWAYS, Tetris_game_loop, params);


   // Bind Keyboard Controls
   Input_keyboard_bind_keydown_callback(Keyboard_input_keydown);
   Input_keyboard_bind_keyup_callback(Keyboard_input_keyup);
}
function Tetris_game_loop(params) {

   if(in_remove_row_animation) return;

   const section = params.params.section;

   const token = curr_token;
   
   const movey = speed;
   
   let has_collide = false;

   if(!DEBUG_NOT_MOVE_DOWN) {

      token.MoveDown(movey);

   }
   
   token.UpdatePos();
   
   /*********************************************************************************/
   // Token mesh with grid bottom collision
   if(token.lower_row_idx <= 0 ) {
      
      has_collide = true;

      // Create pound animation
      // Create_pound_animation(token, section_bot- _cells_buffer.buffer[token.cells.buffer[i]].geom.dim[1]);
   }
   /*********************************************************************************/
   // Check collision with grid cells
   else{

      for(let i=0; i<token.num_cells; i++){
   
         // The column index taken from the token's cols buffer
         const col_idx = token.cols[i];
         
         const any_active = _grid_columns.buffer[col_idx].active_count;
         if(any_active > 0) {
            
            const col_top_elem = _grid_columns.buffer[col_idx].boundary;
            
            const row_idx = token.rows[i];
            if(col_top_elem === row_idx-1){
               has_collide = true;
               break;
            }
         }
      }
   }
   




   /*******************************************************************************/
   // Resolve Collision
   if(has_collide) {



      Grid_add_cells_from_token(token);

      // END the game
      if(tetris_end) {
         Tetris_end();
         return;
      }

      if(DEBUG_PRINT){
         console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$\nAfter token is added to grid')   
         Debug_print()
      }
         
      
      // Store tokens rows that have a cell, for the check_row_compleyion before token reset 
      const token_cells_rows = [];
      for(let k=0; k<token.rows.length; k++){

         if(token.rows[k] !== INT_NULL){

            // Add only unique rows, starting from index 1 of course
            if(k > 0){
               const exists = Gen_array_check_for_existing_element(token_cells_rows, token.rows[k])
               if(!exists) token_cells_rows.push(token.rows[k]);
            }
            else token_cells_rows.push(token.rows[k]);
         }
      }

      // console.log('Checking row completion from rows buffer:', token.rows)
         
      Tetris_create_token(TETRIS_TOKEN_IDS.LINE, section);
         
      Grid_check_row_completion(token_cells_rows)
   }

}


function Tetris_end() {

   Time_intervals_destroy_byidx(game_loop_time_interval_idx);
   console.log('------------------------------- END -------------------------------')
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
      const mesh = _cells_buffer.buffer[complete_rows_cell_idxs[i]].mesh;
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
      const mesh = _cells_buffer.buffer[complete_rows_cell_idxs[i]].mesh;
      mesh.geom.pos[1] = target_posy;
      Gl_set_wpos_y(mesh.gfx, target_posy, 1);
   }

   return false;
}



/******************************************************************************************************************************/
// Create Remove Row Animation
function Create_row_animation(complete_rows_cell_idxs, rowidxs) {

   // // Color and move animation
   // const params = {
   //    complete_rows_cell_idxs: complete_rows_cell_idxs,
   //    all_rgb_maxed:0x0,
   //    rowidxs:rowidxs,
   // };
   
   
   // Callback_animations_create(Animation_row_run, Animation_row_stop, params, 'TetrisColor_MoveAnimation');
   
   in_remove_row_animation = true;
   
   // Scale animation 
   
   const params = {
      // complete_rows_cell_idxs: complete_rows_cell_idxs,
      rowidxs:rowidxs,
      cell_buffer_idx:0,
   };
   
   // Create scale animation
   Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params, 'TetrisScaleAnimation');
}


/******************************************************************************************************************************/
// Color-intensity and Move animation
function Animation_row_run(params) {

   // !! Runs for all tokens of a row, so 1 callback_animation that will call remove row once.

   const complete_rows_cell_idxs = params.complete_rows_cell_idxs;
   const c = .02;
   let stop_anim = false;

   const len = complete_rows_cell_idxs.length;
   for(let i=0; i<len; i++){
      
      const mesh = _cells_buffer.buffer[complete_rows_cell_idxs[i]].mesh;

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
      move_amt:3,
      thershold:.2,
      rowidxs:params.rowidxs,
      all_finished:true,
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
      
      const mesh = _cells_buffer.buffer[complete_rows_cell_idxs[i]].mesh;
      mesh.geom.pos[1] += y;
      Gl_add_wpos_y(mesh.gfx, y, 1);

      if( mesh.geom.pos[1] < DEVICE.MAX_HEIGHT+100) params.all_finished = false;
   }

   // params.move_amt *= .98;
   params.move_amt *= 1.02;
   // Stop animation when a certain threshold has been reached
   // if(params.move_amt < thershold) 
   if(params.all_finished) 
      return false

   params.all_finished = true;
   return true;

}
function Animation_row_destroy_stop(params) {

   const rowidxs = params.rowidxs;
   const boundary = rowidxs.length-1;

   for(let i=boundary; i>=0; i--){

      console.log('Removing Row:', rowidxs[i])
      Grid_remove_row(rowidxs[i]);
   }
   Grid_move_all_down(rowidxs);

   if(DEBUG_PRINT){
      console.log('#############################################################################################\nAfter grid row has been removed')   
      Debug_print()
   }

   in_remove_row_animation = false;
   complete_rows_cell_idxs = [];
   complete_rows_idxs = [];

   return false;
}



/******************************************************************************************************************************/
// Scale animation
function Animation_scale_up_run(params) {

   // const complete_rows_cell_idxs = params.complete_rows_cell_idxs;
   const cell_buffer_idx = params.cell_buffer_idx;
   const cell_idx = complete_rows_cell_idxs[cell_buffer_idx];

   const cell = _cells_buffer.buffer[cell_idx];
   const slope_constant = init_slope;
   const prev_slope_val = cell.prev_slope_val;
   const scale = cell.scale;


   cell.time += cell.time_step;
   const slope = Logarithmic_interpolation(cell.time, slope_constant);

   const mesh = cell.mesh;
   const size = -(slope-prev_slope_val) * scale;

   mesh.geom.dim[0] += size;
   mesh.geom.dim[1] += size;
   mesh.geom.AddDimXY(mesh.gfx, size, size);
   Gl_add_dim_xy(mesh.gfx, size, size);

   
   if (mesh.sid.attr & SID.ATTR.R_CORNERS) {
      // mesh.mat.style.rcorners = (TOKEN_SIZE/2) * (slope-prev_slope_val) * scale;
      mesh.mat.style.rcorners = mesh.geom.dim[0]/2;
      Gl_set_attr_round_corners(mesh.gfx, mesh.mat.style.rcorners);
   }
   
   cell.prev_slope_val = slope;

   
   // Create scale up for the next cell mesh
   const next_cell_idx = cell_buffer_idx+1; 
   const next = complete_rows_cell_idxs[next_cell_idx]; // Get the next cell index from the 
   const next_cell = _cells_buffer.buffer[next];
   if (next_cell_idx < complete_rows_cell_idxs.length) {
      if (slope > cell.next_anim_start && !next_cell.in_animation) {

         // Set the next cell in animation mode
         next_cell.in_animation = true;

         // Create animation for next cell
         const params2 = {
            // complete_rows_cell_idxs:params.complete_rows_cell_idxs,
            rowidxs:params.rowidxs,
            cell_buffer_idx:next_cell_idx,
         };

         Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params2);
      }
   }



   if (slope < 1.) return true;
   else 
      return false

}

function Animation_scale_up_stop(params) {

   // Callback_animations_create(Animation_scale_down_run, Animation_scale_down_stop, params, `Run:TetrisScaleDownAnimation`)

   const cell_buffer_idx = params.cell_buffer_idx;
   const cell_idx = complete_rows_cell_idxs[cell_buffer_idx];
   const cell = _cells_buffer.buffer[cell_idx];

   // Reset Cell's properties
   cell.time = 0;
   cell.prev_slope_val = 0;
   cell.in_animation = false;
   
   
   // Reset mesh's properties
   const mesh = cell.mesh;
   mesh.geom.pos[1] = OUT_OF_VIEW;
   Gl_set_wpos_y(mesh.gfx, OUT_OF_VIEW);


   console.log('Cell cell_idx:', cell_idx, 'reseted. cell.in_animation=', cell.in_animation)


   // Remove cell rows
   const last_elem_idx = complete_rows_cell_idxs.length-1;
   if(cell_idx === complete_rows_cell_idxs[last_elem_idx]) {

      const rowidxs = params.rowidxs;
      const boundary = rowidxs.length-1;
   
      for(let i=boundary; i>=0; i--){
   
         console.log('Removing Row:', rowidxs[i])
         Grid_remove_row(rowidxs[i]);
      }
      Grid_move_all_down(rowidxs);

      // Reset completed rows buffer
      in_remove_row_animation = false;
      complete_rows_cell_idxs = [];
      complete_rows_idxs = [];

      console.log('complete_rows_cell_idxs', complete_rows_cell_idxs, 'complete_rows_idxs', complete_rows_idxs);
   }


   return false;
}

// function Animation_scale_down_run(params) {

//    const complete_rows_cell_idxs = params.complete_rows_cell_idxs;
//    const cell_buffer_idx = params.cell_buffer_idx;
//    const cell_idx = complete_rows_cell_idxs[cell_buffer_idx];

//    const cell = _cells_buffer.buffer[cell_idx];
//    const slope_constant = init_slope;
//    const prev_slope_val = cell.prev_slope_val;
//    const scale = cell.scale;


//    cell.time += cell.time_step;
//    const slope = Logarithmic_interpolation(cell.time, slope_constant);

//    const mesh = _cells_buffer.buffer[cell_idx].mesh;
//    const size = ((slope-prev_slope_val) * scale);

//    mesh.geom.dim[0] -= size;
//    mesh.geom.dim[1] -= size;
//    mesh.geom.AddDimXY(mesh.gfx, -size, -size);
//    Gl_add_dim_xy(mesh.gfx, -size, -size);
   
//    // if (mesh.sid.attr & SID.ATTR.R_CORNERS) {
//    //    mesh.mat.style.rcorners -= size;
//    //    Gl_set_attr_round_corners(mesh.gfx, mesh.mat.style.rcorners);
//    // }
   
//    cell.prev_slope_val = slope;




//    if (slope < 1.) return true;
//    else return false
// }

// function Animation_scale_down_stop(params) {

//    // Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params, `Stop:TetrisScaleDownAnimation`);

//    const complete_rows_cell_idxs = params.complete_rows_cell_idxs;
//    const cell_buffer_idx = params.cell_buffer_idx;
//    const cell_idx = complete_rows_cell_idxs[cell_buffer_idx];

//    const cell = _cells_buffer.buffer[cell_idx];

//    const mesh = _cells_buffer.buffer[cell_idx].mesh;

//    // mesh.geom.pos[0] = OUT_OF_VIEW;
//    mesh.geom.pos[1] = OUT_OF_VIEW;
//    Gl_set_wpos_y(mesh.gfx, OUT_OF_VIEW);
//    // mesh.geom.SetPosY(mesh.gfx, 1200);
//    // Gl_add_dim_xy(mesh.gfx, -size, -size);

//    cell.time = 0;
//    cell.prev_slope_val = Logarithmic_interpolation(cell.time, init_slope);
//    cell.in_animation = false;
//    cell.in_scale_up_animation = false;

//    // const rowidxs = params.rowidxs;
//    // const boundary = rowidxs.length-1;

//    // for(let i=boundary; i>=0; i--){

//    //    console.log('Removing Row:', rowidxs[i])
//    //    Grid_remove_row(rowidxs[i]);
//    // }
//    // Grid_move_all_down(rowidxs);

//    // if(DEBUG_PRINT){
//    //    console.log('#############################################################################################\nAfter grid row has been removed')   
//    //    Debug_print()
//    // }

   
//    const last_elem_idx = params.complete_rows_cell_idxs.length-1;
//    console.log(cell_idx, params.complete_rows_cell_idxs[last_elem_idx])
//    if(cell_idx === params.complete_rows_cell_idxs[last_elem_idx]) {

//       const rowidxs = params.rowidxs;
//       const boundary = rowidxs.length-1;
   
//       for(let i=boundary; i>=0; i--){
   
//          console.log('Removing Row:', rowidxs[i])
//          Grid_remove_row(rowidxs[i]);
//       }
//       Grid_move_all_down(rowidxs);


//       in_remove_row_animation = false;
//       params.complete_rows_cell_idxs = [];
//       complete_rows_idxs = [];
//    }

   
//    return false;
// }






























function Debug_print(){
   console.log('------------------------------------------------------------------------------------',)   

   for(let j=MAX_TOKENS_IN_Y_AXIS-1; j>=0; j--){


      // let row = [-1,-1,-1,-1]
      let row = []
      let cnt = 0;
      let print = false;
      
      for(let i=0; i<MAX_COLUMNS; i++){
            
         const col = _grid_columns.buffer[i];

         if(col.buffer[j] !== INT_NULL){
            // row[cnt] = `${col.buffer[j]}`;
            row[cnt] = 'o';
            print=true
         }
         else row[cnt] = ' ';
         
         cnt++;
      }

      console.log('row', j, ':', row );

   }
   
   
   const active_count = [], boundary = []; 
   
   for(let i=0; i<MAX_COLUMNS; i++){
      
      const col = _grid_columns.buffer[i];
      boundary.push(`${col.boundary}`);
      active_count.push(`${col.active_count}`);
      
   }
   console.log('---------\nboundar', boundary)
   console.log('active_', active_count)
   
   
   console.log('!!!!!!!!!!!!!!!!!!!!!!!!!', _cells_buffer.buffer[12])

}