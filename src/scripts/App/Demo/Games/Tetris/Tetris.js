"use strict";

import { Callback_animations_create, Callback_animations_destroy } from "../../../../Engine/Animations/CallbackAnimations.js";
import { Input_keyboard_bind_keydown_callback, Input_keyboard_bind_keyup_callback } from "../../../../Engine/Controls/Input/Keyboard.js";
import { New_generic_buffer, New_int16_buffer } from "../../../../Engine/Core/Buffers.js";
import { Create_widget_close_btn, Create_widget_label } from "../../../../Engine/Drawables/Widgets/Helpers/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../../../Engine/Core/Views/RootView.js";
import { BLUEL, GREEN, GREY, PURPLE, PURPLEB, PURPLER, WHITE, YELLOW } from "../../../../Engine/Drawables/Material/Colors.js";
import { Mesh_get_real_pos_x, Mesh_get_real_pos_y } from "../../../../Engine/Drawables/Operations/MeshAttributesFunctions.js";
import { Mesh_get_uniform_ubidx_from_name, Mesh_set_root_in_focus } from "../../../../Engine/Drawables/Operations/MeshHelperFunctions.js";
import { Mesh_event_callback_create } from "../../../../Engine/Drawables/Operations/MeshPropertiesFunctions.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../../../Engine/Events/EventFunctions.js";
import { Particle_system_create_emitter, Particle_system_emitt, Particles_gen_gfx_ctx, Particles_get_particle_system } from "../../../../Engine/ParticlesSystem/ParticlesSystem.js";
import { Scene_camera_scroll_set } from "../../../../Engine/Scenes.js";
import { Time_intervals_create, Time_intervals_destroy_byidx } from "../../../../Engine/Timers/TimeIntervals.js";
import { Vertex_buffer_set_and_update_uniform } from "../../../../Graphics/Buffers/VertexBuffers.js";
import { Gl_add_dim_xy, Gl_add_wpos_y, Gl_set_attr_round_corners, Gl_set_dim_xy, Gl_set_rgb, Gl_set_wpos_xy, Gl_set_wpos_y } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { Bubble_sort } from "../../../../Helpers/Helpers.js";
import { Logarithmic_interpolation } from "../../../../Helpers/Math/MathFunctions.js";
import { Abs, Floor, Fract } from "../../../../Helpers/Math/MathOperations.js";
import { App_reinitialize, App_reset } from "../../../App.js";
import { Demo_page } from "../../../DemoPage.js";




const DEBUG_PRINT = false;
const DEBUG_PRINT2 = false;
const DEBUG_NOT_MOVE_DOWN = false;




let _cnt = 0x1;
const TETRIS_TOKEN_IDS = {
   DEF: _cnt,
   LINE: _cnt <<= 0x1,
}
/**
 * NEEDS TO BE RE-IMPLEMENTED
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
   top_row: 0
};

const MAX_COLUMNS = 8;
const TOKEN_SIZE = 25;
const MAX_TOKENS_IN_Y_AXIS = 12;
const TOP_ROW = MAX_TOKENS_IN_Y_AXIS - 1;
const ROW_HEIGHT = TOKEN_SIZE * 2;
const COL_WIDTH = TOKEN_SIZE * 2;
const TETRIS_PANEL_HEIGHT = MAX_TOKENS_IN_Y_AXIS * TOKEN_SIZE;
const TETRIS_PANEL_WIDTH = TOKEN_SIZE * MAX_COLUMNS;
const tetris_panel_pad = 10;
let speed = 1.;
const def_speed = speed;
// const cell_round_corners = TOKEN_SIZE;
// const cell_round_corners = TOKEN_SIZE/2;
const cell_round_corners = 10;
const cell_feather = 2.6;

// Indexes to a specific token's pivots
const ROTATION_STATES = {
   UP: 0,
   RIGHT: 1,
   DOWN: 2,
   LEFT: 3,
};

const TOKEN_TYPE = {
   RECT: 0,
   LINE: 1,
   L: 2,
   L_MIRRORED: 3,
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
   [2, 2, 2, 2], // Rotation state: Rect
   [2, 2, 2, 2], // Rotation state: Line
   [2, 2, 2, 2], // Rotation state: L
   [2, 2, 2, 2], // Rotation state: L_mirrored
];






const init_slope = .28;
let in_remove_row_animation = false;
let tetris_end = false;
let game_loop_time_interval_idx = INT_NULL;
let tetris_panel_posx = 0;
let tetris_panel_posy = 0;
let is_activated_by_demo = false, activation_id = 0x0;
let complete_rows_cell_idxs = []; // TODO: create Int16 buffers, to easily reset/reuse them
let complete_rows_idxs = [];

const grid_top_cells_row_idxs = new Int16Array(MAX_COLUMNS);





function Gen_array_check_for_existing_element(arr, elem) {

   // if(DEBUG.DEFENSIVE) if(arr instanceof Array) alert('776658876 \n arr is not a type of Array')

   let same_found = false;

   const len = arr.length;

   for(let i=0; i<len; i++) {

      if(arr[i] === elem) {
         same_found = true;
         break;
      }
   }

   return same_found;
}



/*********************************************************************************************************/
// Keyboard input
/** */
function Keyboard_input_keydown(params) {

   const key = params.key;
   const keycode = params.event.keyCode;
   // console.log(key, keycode);

   if (keycode === INPUT_KEYCODE_PAUSE) {
      // console.log(_grid_columns)
      // if(STATE.loop.paused === false)
      //    STATE.loop.paused = true;
      // else STATE.loop.paused = false;
   }

   if (keycode === INPUT_KEYCODE_LEFT) {
      curr_token.MoveLeft();
   }
   else if (keycode === INPUT_KEYCODE_RIGHT) {
      curr_token.MoveRight();
   }
   else if (keycode === INPUT_KEYCODE_DOWN) {
      speed = 10;
   }
   else if (keycode === INPUT_KEYCODE_SPACE) {
      curr_token.RotateRight()
   }
   else if (keycode === INPUT_KEYCODE_D) {
      curr_token.RotateRight()
   }
   else if (keycode === INPUT_KEYCODE_A) {
      curr_token.RotateLeft()
   }
}
/** */
function Keyboard_input_keyup(params) {

   const key = params.key;
   const keycode = params.event.keyCode;
   // console.log(key, keycode);


   if (keycode === INPUT_KEYCODE_DOWN) {
      speed = def_speed;
   }
}




/*********************************************************************************************************/
// Mesh-Cell Properties Class
/** */
class Cell_Properties {

   constructor(_mesh = null, glow_intensity = 1) {

      if (!_mesh) alert('000000000012')

      this.mesh = _mesh;
      this.idx = INT_NULL;
      this.size = TOKEN_SIZE;

      // A modifier for the calculation of the slope function that controls the next position 
      this.time = 0; // Values = [0-1]
      this.time_step = 0.014; // Values = [0-1]
      this.prev_slope_val = 0;// Stores the current calculated 'time' to be used on the next 'Move' calculation. 
      this.next_anim_start = .3; // The slope's value at which the next cell animation should min
      this.in_animation = false;
      this.glow_intensity = glow_intensity;
      this.scale = 30;
      this.colidx = INT_NULL;
      this.rowidx = INT_NULL;

   }
}




/*********************************************************************************************************/
// Buffers
const _grid_columns = New_generic_buffer(_, 'TetrisGridColumns');
const _cells_buffer = New_generic_buffer(_, 'TetrisCells');
const _free_cells_buffer = New_int16_buffer(16, 'TetrisFreeCells');



/*********************************************************************************************************/
// Grid functions
/** */
function Tetris_initialize_grid() {


   for (let i = 0; i < MAX_COLUMNS; i++) {

      const num_tokens_height = TETRIS_PANEL_HEIGHT / TOKEN_SIZE;
      const col_idxs = New_int16_buffer(num_tokens_height, `TetrisColumn${i}`);

      _grid_columns.Add(col_idxs);

      // Initialize grids top cells row indexes
      grid_top_cells_row_idxs[i] = INT_NULL;
   }

}
/** */
function Grid_get_colidx_from_posx(xpos) {

   const x = xpos - tetris_panel_pad - TOKEN_SIZE;
   const col_idx = (x !== 0) ? x / COL_WIDTH : 0;

   if (DEBUG_PRINT2) if (Fract(col_idx))
      console.error('3312241544321 col_idx is not an int')

   return col_idx;
}
/** */
function Grid_get_rowidx_from_posy(ypos) {

   const y = ypos - tetris_panel_pad - TOKEN_SIZE;
   const row_idx = (y !== 0) ? TOP_ROW - Floor(y / ROW_HEIGHT) : 0;
   return row_idx;
}
/** */
function Grid_get_posy_from_rowidx(rowidx) {

   const y = ((TOP_ROW - rowidx) * ROW_HEIGHT);
   return y;
}
/** */
function Grid_get_posx_from_colidx(colidx) {

   const x = ((colidx * COL_WIDTH) + TOKEN_SIZE + tetris_panel_pad);
   return x;
}
/** */
function Grid_remove_row(row_idx) {

   for (let i = 0; i < MAX_COLUMNS; i++) {

      // Store all removed cells as to a buffer 'free'
      Cell_store_free_cell(_grid_columns.buffer[i].buffer[row_idx]);

      // Shift elements left from the row index and after
      _grid_columns.buffer[i].buffer[row_idx] = INT_NULL;
      _grid_columns.buffer[i].active_count--;

   }

}
/** */
function TEMP_recalc_boundary() {
   // Recalc the boundary
   for (let i = 0; i < MAX_COLUMNS; i++) {
      _grid_columns.buffer[i].boundary = INT_NULL;
      const min = _grid_columns.buffer[i].size - 1;
      for (let j = min; j >= 0; j--) {
         if (_grid_columns.buffer[i].buffer[j] !== INT_NULL) {
            _grid_columns.buffer[i].boundary = j;
            break;
         }
      }
   }
}
/** */
function TEMP_find_max_val_from_arr(arr) {

   let max = arr[0];
   const len = arr.length;

   for (let i = 1; i < len; i++) {
      if (arr[i] > max)
         max = arr[i];
   }

   return max;
}
/** */
function TEMP_find_min_val_from_arr(arr) {

   let min = arr[0];
   const len = arr.length;

   for (let i = 1; i < len; i++) {
      if (arr[i] !== INT_NULL && arr[i] < min)
         min = arr[i];
   }

   return max;
}
/** */
function Grid_move_all_down(row_idxs) {

   const num_rows = row_idxs.length;

   let move_rows = 0;
   let removed_cnt = 0;

   const rows = row_idxs;

   for (let i = 0; i <= GRID.top_row; i++) {

      // Calculate how many rows to move down until next row to be removed
      if (rows[removed_cnt] === i && removed_cnt < num_rows) {

         move_rows++;
         removed_cnt++;
      }
      else if (move_rows > 0) {

         for (let k = 0; k < MAX_COLUMNS; k++) {

            const cellidx = _grid_columns.buffer[k].buffer[i];
            let total_height = ROW_HEIGHT * move_rows;

            if (cellidx !== INT_NULL) {

               const mesh = _cells_buffer.buffer[cellidx].mesh;
               mesh.geom.pos[1] += total_height;
               Gl_add_wpos_y(mesh.gfx, total_height, 1);

               // Update the cell's row index variable
               _cells_buffer.buffer[cellidx].rowidx -= move_rows;

               // Could be inside the if cell!==INT_NULL
               _grid_columns.buffer[k].buffer[i - move_rows] = _grid_columns.buffer[k].buffer[i];
               _grid_columns.buffer[k].buffer[i] = INT_NULL;
            }
         }
      }
   }

   // TODO: Avoid recalc by correcting the whole proccess of cell rows removal
   TEMP_recalc_boundary();

   GRID.top_row -= move_rows;

}
/** */
function Grid_add_cells_from_token(token) {

   if (DEBUG_PRINT2) console.log('ADDING TOKEN:', 'token.cols[i]', token.cols, 'token.rows[i]', token.rows);
   for (let i = 0; i < token.num_cells; i++) {

      const cellidx = token.cells.buffer[i];
      const col_idx = token.cols[i];
      const row_idx = token.rows[i];

      // Update the cell's row-column index variables
      _cells_buffer.buffer[cellidx].rowidx = row_idx;
      _cells_buffer.buffer[cellidx].colidx = col_idx;

      if (DEBUG_PRINT2) console.log('i:', i, 'col_idx', col_idx, 'row_idx', row_idx, 'cellidx', cellidx);


      if (row_idx >= MAX_TOKENS_IN_Y_AXIS) {

         tetris_end = true;
         return;
      }

      _grid_columns.buffer[col_idx].AddAtIndex(row_idx, cellidx);

      // Store any cell that is higher
      // TODO: If token's cells are sorted from left to right, bottom to top, then we need not to check if cur token cell is greater than the previous stored
      if (row_idx > grid_top_cells_row_idxs[col_idx]) {
         grid_top_cells_row_idxs[col_idx] = row_idx;
      }


      if (GRID.top_row < row_idx) GRID.top_row = row_idx;

   }

}
/** */
function Grid_check_row_completion(token_cells_rows, emitter) {

   if (in_remove_row_animation) return;

   if (DEBUG_PRINT) console.log('---- CHECKING ROWS ----')

   let complete_rows_cnt = 0; // A row counter to run for all completed rows

   const len = token_cells_rows.length;
   let is_row_complete = false;

   let rowidx = INT_NULL;
   for (let j = 0; j < len; j++) {

      let cell_cnt = 0;

      // Avoid repeat same rows, by checking the prev row(Row indexes MUST be sorted) 

      rowidx = token_cells_rows[j];

      // Check if row is complete
      for (let i = 0; i < MAX_COLUMNS; i++) {

         const col = _grid_columns.buffer[i];

         if (col.buffer[rowidx] !== INT_NULL) {

            cell_cnt++; // add all existing tokens of this row.

            if (cell_cnt === MAX_COLUMNS) {
               complete_rows_idxs.push(rowidx);

               is_row_complete = true; // Is at least one row complete
               break;
            }
         }
         else break; // Break if at least one cell is missing for a complete row
      }

      // If the number of cells in a row are equal to the number of columns, we have a completed row
      // Push all row tokens to a buffer so we can remove them 
      if (complete_rows_idxs[complete_rows_cnt] !== undefined) {
         for (let i = 0; i < MAX_COLUMNS; i++) {
            const cell_idx = _grid_columns.buffer[i].buffer[complete_rows_idxs[complete_rows_cnt]];
            complete_rows_cell_idxs.push(cell_idx);
         }
         complete_rows_cnt++;
      }
   }



   if (is_row_complete) {
      if (DEBUG_PRINT) console.log('@#$@#$ @#$@#$ @#$@#$ @#$@#$ @#$@#$ @#$@#$');
      if (DEBUG_PRINT) console.log('complete_rows_cell_idxs', complete_rows_cell_idxs, 'complete_rows_idxs', complete_rows_idxs);
      const rows = Bubble_sort(complete_rows_idxs);
      Create_row_animation(complete_rows_cell_idxs, rows, emitter);
   }
}













/*********************************************************************************************************/
// Cell functions
/** */
function Cell_create(offsetx = 0, offsety = 0, col) {

   const color = col !== undefined ? col : YELLOW[9];
   const mesh = Create_rect_mesh(_, _, [0, 0], [tetris_panel_pad + (TOKEN_SIZE * 2 * offsetx), tetris_panel_pad + (TOKEN_SIZE * 2 * offsety), 0], [TOKEN_SIZE, TOKEN_SIZE], color, 'mesh');
   mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   mesh.EnableGfxUniforms({ unif: SID.UNIF.U_SCALE_VEC2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
   mesh.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
   mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
   mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, cell_round_corners);
   mesh.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   mesh.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL;

   const cell = new Cell_Properties(mesh);

   if (DEBUG_PRINT2) console.log('CREATING NEW CELL', cell)

   const cellidx = _cells_buffer.Add(cell);

   return {
      mesh: mesh,
      idx: cellidx,
   };
}
/** */
function Cell_store_free_cell(cellidx) {
   _free_cells_buffer.Add(cellidx);
   if (DEBUG_PRINT2) console.log('FREE CELL STORE:', cellidx, _cells_buffer.buffer[cellidx])
}
/** */
function Cell_get_free_cell() {

   const last_elem = _free_cells_buffer.boundary;
   if (last_elem >= 0) {

      const free_cell_idx = _free_cells_buffer.buffer[last_elem];
      _free_cells_buffer.RemoveByIdxSortedVersionLastElemGuarantee();
      if (DEBUG_PRINT2) console.log('USED CELL FOUND. free_cell_idx:', free_cell_idx, 'cell', _cells_buffer.buffer[free_cell_idx])
      return free_cell_idx;
   }

   return INT_NULL;
}



/**
 * TOKENS
 * Rotate horizontal: Take the ypos of the second cell, and occupy from -1 cell(being inside boundaries) to +3 cell
 * Rotate vertical: Take the ypos of the second cell, and occupy from -1 to +3
 */
/** */
function Mat2_mult_vec2(mat, x, y) {

   return [
      (mat[0][0] * x) + (mat[0][1] * y),
      (mat[1][0] * x) + (mat[1][1] * y),
   ];
}

/** */
const mat_rot_90_clockwise = [
   [0, 1],
   [-1, 0]
];
/** */
const mat_rot_90_counterclockwise = [
   [0, -1],
   [1, 0]
];


/** */
function Min_of_4(arr4) {
   const min = arr4[0] < arr4[1] ? arr4[0] : arr4[1] < arr4[2] ? arr4[1] : arr4[2] < arr4[3] ? arr4[2] : arr4[3];
   return min;
}
/** */
function Max_of_4(arr4) {
   const max = arr4[0] > arr4[1] ? arr4[0] : arr4[1] > arr4[2] ? arr4[1] : arr4[2] > arr4[3] ? arr4[2] : arr4[3];
   return max;
}
/** */
function Token_get_left_most_col(cols) {
   return Min_of_4(cols);
}
/** */
function Token_get_right_most_col(cols) {
   return Max_of_4(cols);
}
/** */
function Token_get_lower_most_row(rows) {
   return Min_of_4(rows);
}



/*********************************************************************************************************/
// Tokens
// TODO: Implement token rotattions with being able to rotate at any state that is valid, when token is restricted left and right by grid cells
const helper_arr_new_col = new Int16Array([INT_NULL, INT_NULL, INT_NULL, INT_NULL]);
const helper_arr_new_row = new Int16Array([INT_NULL, INT_NULL, INT_NULL, INT_NULL]);
/** */
class Token {

   constructor(rotation_state) {

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
   Reset() {
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
   AddCell(cellidx, colidx, rowidx, token_type = TOKEN_TYPE.LINE, rotation_state = ROTATION_STATES.UP) {

      this.cells.Add(cellidx);

      this.cols[this.num_cells] = colidx; // Put tokens rect to 0-th column
      this.rows[this.num_cells] = rowidx; // Put tokens rect to top row

      if ((colidx > this.right_most_col)) this.right_most_col = colidx
      if ((colidx < this.left_most_col) || this.left_most_col === INT_NULL) this.left_most_col = colidx

      this.rotation_state = rotation_state;
      this.token_type = token_type;

      this.num_cells++;

   }
   RotateLeft() {

      // Pivot cell for center of rotation
      let pivot = _token_rotation_states_pivots[this.token_type][this.rotation_state];

      if (DEBUG_PRINT2) console.log('this.right_most_col', this.right_most_col);

      const px = this.cols[pivot], py = this.rows[pivot];


      let needs_moving_left = false, needs_moving_right = false;
      let move_cols = 0;
      for (let i = 0; i < this.num_cells; i++) {

         const res = Mat2_mult_vec2(mat_rot_90_counterclockwise, this.cols[i] - px, this.rows[i] - py);

         const new_col = res[0] + px;
         const new_row = res[1] + py;

         // Case the rotating token is out of boundaries
         if ((new_col < 0) && (move_cols < Abs(new_col))) {
            needs_moving_right = true;
            move_cols = Abs(new_col);
         }
         if ((new_col >= MAX_COLUMNS - 1) && (move_cols < new_col - (MAX_COLUMNS - 1))) {
            needs_moving_left = true;
            move_cols = new_col - (MAX_COLUMNS - 1);
         }


         // Check collisions with other grid cells
         if (new_col >= 0 && new_col < MAX_COLUMNS) {

            const colidx = new_col; // Hypotheticaly move to the left
            if (_grid_columns.buffer[colidx].boundary !== INT_NULL) { // If the grid column has any cell

               const rowidx = new_row;
               if (rowidx < MAX_TOKENS_IN_Y_AXIS) { // Avoid ending the game if token is at top and beyond

                  // If the grid cell exists at the hypothetical moved token cell position... don't move
                  if (_grid_columns.buffer[new_col].buffer[rowidx] !== INT_NULL) {
                     return;
                  }
               }
            }
         }

         helper_arr_new_col[i] = new_col;
         helper_arr_new_row[i] = new_row;

      }

      // If no restriction found, store the rotated token's cells coordinates
      this.cols[0] = helper_arr_new_col[0];
      this.cols[1] = helper_arr_new_col[1];
      this.cols[2] = helper_arr_new_col[2];
      this.cols[3] = helper_arr_new_col[3];
      this.rows[0] = helper_arr_new_row[0];
      this.rows[1] = helper_arr_new_row[1];
      this.rows[2] = helper_arr_new_row[2];
      this.rows[3] = helper_arr_new_row[3];

      // Case bounaries restriction found and the token needs to be moved away from the boundary
      if (needs_moving_left) this.MoveLeft(move_cols);
      if (needs_moving_right) this.MoveRight(move_cols);

      this.left_most_col = Token_get_left_most_col(this.cols);
      this.right_most_col = Token_get_right_most_col(this.cols);
      this.lower_row_idx = Token_get_lower_most_row(this.rows);

      this.rotation_state--;
      if (this.rotation_state < 0) this.rotation_state = 3;

   }
   RotateRight() {

      let pivot = _token_rotation_states_pivots[this.token_type][this.rotation_state];

      if (DEBUG_PRINT2) console.log('this.right_most_col', this.right_most_col);

      const px = this.cols[pivot], py = this.rows[pivot];
      let needs_moving_left = false, needs_moving_right = false;
      let move_cols = 0;
      for (let i = 0; i < this.num_cells; i++) {

         const res = Mat2_mult_vec2(mat_rot_90_clockwise, this.cols[i] - px, this.rows[i] - py);

         const new_col = res[0] + px;
         const new_row = res[1] + py;

         // Case the rotaing token is out of boundaries
         if ((new_col < 0) && (move_cols < Abs(new_col))) {

            needs_moving_right = true;
            move_cols = Abs(new_col);
         }
         if ((new_col >= MAX_COLUMNS - 1) && (move_cols < new_col - (MAX_COLUMNS - 1))) {
            needs_moving_left = true;
            move_cols = new_col - (MAX_COLUMNS - 1);
         }

         // Check collisions with other grid cells
         if (new_col >= 0 && new_col < MAX_COLUMNS) {

            const colidx = new_col; // Hypotheticaly move to the left
            if (_grid_columns.buffer[colidx].boundary !== INT_NULL) { // If the grid column has any cell

               const rowidx = new_row;
               if (rowidx < MAX_TOKENS_IN_Y_AXIS) { // Avoid ending the game if token is at top and beyond

                  // If the grid cell exists at the hypothetical moved token cell position... don't move
                  if (_grid_columns.buffer[new_col].buffer[rowidx] !== INT_NULL) {
                     return;
                  }
               }
            }
         }

         helper_arr_new_col[i] = new_col;
         helper_arr_new_row[i] = new_row;

      }

      // If no restriction found, store the rotated token's cells coordinates
      this.cols[0] = helper_arr_new_col[0];
      this.cols[1] = helper_arr_new_col[1];
      this.cols[2] = helper_arr_new_col[2];
      this.cols[3] = helper_arr_new_col[3];
      this.rows[0] = helper_arr_new_row[0];
      this.rows[1] = helper_arr_new_row[1];
      this.rows[2] = helper_arr_new_row[2];
      this.rows[3] = helper_arr_new_row[3];

      // Case bounaries restriction found and the token needs to be moved away from the boundary
      if (needs_moving_left) this.MoveLeft(move_cols);
      if (needs_moving_right) this.MoveRight(move_cols);

      this.left_most_col = Token_get_left_most_col(this.cols);
      this.right_most_col = Token_get_right_most_col(this.cols);
      this.lower_row_idx = Token_get_lower_most_row(this.rows);

      this.rotation_state++;
      if (this.rotation_state > 3) this.rotation_state = 0;

   }
   MoveLeft(move_cols = 1) {

      const col_idx = this.left_most_col;
      if (col_idx > 0) {

         // Check collisions with other grid cells
         for (let i = 0; i < 4; i++) {

            const colidx = this.cols[i] - move_cols; // Hypotheticaly move to the left
            if (_grid_columns.buffer[colidx].boundary !== INT_NULL) { // If the grid column has any cell

               const rowidx = this.rows[i];
               if (rowidx < MAX_TOKENS_IN_Y_AXIS) { // Avoid ending the game if token is at top and beyond

                  // If the grid cell exists at the hypothetical moved token cell position... don't move
                  if (_grid_columns.buffer[colidx].buffer[rowidx] !== INT_NULL) {
                     return;
                  }
               }
            }
         }

         // Move token cells
         this.cols[0] -= move_cols;
         this.cols[1] -= move_cols;
         this.cols[2] -= move_cols;
         this.cols[3] -= move_cols;

         this.right_most_col -= move_cols; // If we moved to the right, then increment the right most token's column index
         this.left_most_col -= move_cols; // If we moved to the right, then increment the left most token's column index
      }

   }
   MoveRight(move_cols = 1) {

      const col_idx = this.right_most_col;
      if (col_idx < MAX_COLUMNS - 1) {

         // Check collisions with other grid cells
         for (let i = 0; i < 4; i++) {

            const colidx = this.cols[i] + move_cols; // Hypotheticaly move to the right
            if (_grid_columns.buffer[colidx].boundary !== INT_NULL) { // If the grid column has any cell

               const rowidx = this.rows[i];
               if (rowidx < MAX_TOKENS_IN_Y_AXIS) { // Avoid ending the game if token is at top and beyond

                  // If the grid cell exists at the hypothetical moved token cell position... don't move
                  if (_grid_columns.buffer[colidx].buffer[rowidx] !== INT_NULL) {
                     return;
                  }
               }
            }
         }

         // Move token cells
         if (this.num_cells < 3) alert('009989098 token should have 4 cells in this Move() implementation')
         this.cols[0] += move_cols;
         this.cols[1] += move_cols;
         this.cols[2] += move_cols;
         this.cols[3] += move_cols;

         this.right_most_col += move_cols; // If we moved to the right, then increment the right most token's column index
         this.left_most_col += move_cols; // If we moved to the right, then increment the left most token's column index
      }

   }
   MoveDown(move) {

      this.dist += move;

      for (let i = 0; i < this.num_cells; i++) {

         // Decrement rows for each cell
         if (this.dist >= ROW_HEIGHT && this.rows[i] !== INT_NULL) {
            this.rows[i]--;
         }
      }

      // Advance lower row counter
      if (this.dist >= ROW_HEIGHT) {
         this.lower_row_idx--;
         this.dist = 0;
      }
   }
   UpdatePos() {

      for (let i = 0; i < this.num_cells; i++) {

         const xx = Grid_get_posx_from_colidx(this.cols[i]);
         const yy = Grid_get_posx_from_colidx(TOP_ROW - this.rows[i]);

         const mesh = _cells_buffer.buffer[this.cells.buffer[i]].mesh;
         mesh.geom.pos[1] = xx;
         mesh.geom.pos[1] = yy;
         Gl_set_wpos_xy(mesh.gfx, xx, yy, 1);
      }
   }
}


/** */
let curr_token = null;
/** */
function Cell_reset_mesh(mesh, colidx, rowidx, color) {

   mesh.geom.pos[0] = 10 + (TOKEN_SIZE * 2 * colidx);
   mesh.geom.pos[1] = 10 + (TOKEN_SIZE * 2 * (TOP_ROW - rowidx));
   Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0] + TOKEN_SIZE, mesh.geom.pos[1] + TOKEN_SIZE);
   mesh.geom.dim[0] = TOKEN_SIZE;
   mesh.geom.dim[1] = TOKEN_SIZE;
   Mesh_update_set_dim_xy(mesh);
   Gl_set_dim_xy(mesh.gfx, mesh.geom.dim[0], mesh.geom.dim[1]);


   mesh.SetColorAllRGB(color);

   mesh.mat.style.rcorners = cell_round_corners;
   Gl_set_attr_round_corners(mesh.gfx, mesh.mat.style.rcorners);

}
/** */
function Tetris_create_token_square(section, token) {

   {
      const colidx = 1;
      const rowidx = TOP_ROW;
      const free_cellidx = Cell_get_free_cell();

      if (free_cellidx !== INT_NULL) {

         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         Cell_reset_mesh(mesh, colidx, rowidx, TETRIS_TOKENS_COLORS.RECT);
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.RECT, ROTATION_STATES.UP);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW - rowidx, TETRIS_TOKENS_COLORS.RECT);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.RECT, ROTATION_STATES.UP);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 1;
      const rowidx = TOP_ROW + 1;
      const free_cellidx = Cell_get_free_cell();

      if (free_cellidx !== INT_NULL) {

         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         Cell_reset_mesh(mesh, colidx, rowidx, TETRIS_TOKENS_COLORS.RECT);
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.RECT, ROTATION_STATES.UP);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW - rowidx, TETRIS_TOKENS_COLORS.RECT);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.RECT, ROTATION_STATES.UP);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 2;
      const rowidx = TOP_ROW + 1;
      const free_cellidx = Cell_get_free_cell();

      if (free_cellidx !== INT_NULL) {

         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         Cell_reset_mesh(mesh, colidx, rowidx, TETRIS_TOKENS_COLORS.RECT);
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.RECT, ROTATION_STATES.UP);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW - rowidx, TETRIS_TOKENS_COLORS.RECT);
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

      if (free_cellidx !== INT_NULL) {

         const mesh = _cells_buffer.buffer[free_cellidx].mesh;
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0] + TOKEN_SIZE, mesh.geom.pos[1] + TOKEN_SIZE);
         Cell_reset_mesh(mesh, colidx, rowidx, TETRIS_TOKENS_COLORS.RECT);
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.RECT, ROTATION_STATES.UP);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW - rowidx, TETRIS_TOKENS_COLORS.RECT);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.RECT, ROTATION_STATES.UP);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
}
/** */
function Tetris_create_token_shape_L(section, token) {

   const row = TOP_ROW;
   {
      const colidx = 2;
      const rowidx = row;
      const free_cellidx = Cell_get_free_cell();

      if (free_cellidx !== INT_NULL) {

         const mesh = _cells_buffer.buffer[free_cellidx].mesh;

         Cell_reset_mesh(mesh, colidx, rowidx, TETRIS_TOKENS_COLORS.L);
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.L, ROTATION_STATES.UP);

      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW - rowidx, TETRIS_TOKENS_COLORS.L);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.L, ROTATION_STATES.UP);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 2;
      const rowidx = row + 1;
      const free_cellidx = Cell_get_free_cell();

      if (free_cellidx !== INT_NULL) {

         const mesh = _cells_buffer.buffer[free_cellidx].mesh;

         Cell_reset_mesh(mesh, colidx, rowidx, TETRIS_TOKENS_COLORS.L);
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.L, ROTATION_STATES.UP);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW - rowidx, TETRIS_TOKENS_COLORS.L);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.L, ROTATION_STATES.UP);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 2;
      const rowidx = row + 2;
      const free_cellidx = Cell_get_free_cell();

      if (free_cellidx !== INT_NULL) {

         const mesh = _cells_buffer.buffer[free_cellidx].mesh;

         Cell_reset_mesh(mesh, colidx, rowidx, TETRIS_TOKENS_COLORS.L);
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.L, ROTATION_STATES.UP);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW - rowidx, TETRIS_TOKENS_COLORS.L);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.L, ROTATION_STATES.UP);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 3;
      const rowidx = row + 2;
      const free_cellidx = Cell_get_free_cell();

      if (free_cellidx !== INT_NULL) {

         const mesh = _cells_buffer.buffer[free_cellidx].mesh;

         Cell_reset_mesh(mesh, colidx, rowidx, TETRIS_TOKENS_COLORS.L);
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.L, ROTATION_STATES.UP);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW - rowidx, TETRIS_TOKENS_COLORS.L);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.L, ROTATION_STATES.UP);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
}
/** */
function Tetris_create_token_shape_L_mirror(section, token) {

   const row = TOP_ROW;
   {
      const colidx = 2;
      const rowidx = row;
      const free_cellidx = Cell_get_free_cell();

      if (free_cellidx !== INT_NULL) {

         const mesh = _cells_buffer.buffer[free_cellidx].mesh;

         Cell_reset_mesh(mesh, colidx, rowidx, TETRIS_TOKENS_COLORS.L_MIRROR);
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.L_MIRRORED, ROTATION_STATES.UP);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW - rowidx, TETRIS_TOKENS_COLORS.L_MIRROR);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.L_MIRRORED, ROTATION_STATES.UP);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 2;
      const rowidx = row + 1;
      const free_cellidx = Cell_get_free_cell();

      if (free_cellidx !== INT_NULL) {

         const mesh = _cells_buffer.buffer[free_cellidx].mesh;

         Cell_reset_mesh(mesh, colidx, rowidx, TETRIS_TOKENS_COLORS.L_MIRROR);
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.L_MIRRORED, ROTATION_STATES.UP);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW - rowidx, TETRIS_TOKENS_COLORS.L_MIRROR);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.L_MIRRORED, ROTATION_STATES.UP);;
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 2;
      const rowidx = row + 2;
      const free_cellidx = Cell_get_free_cell();

      if (free_cellidx !== INT_NULL) {

         const mesh = _cells_buffer.buffer[free_cellidx].mesh;

         Cell_reset_mesh(mesh, colidx, rowidx, TETRIS_TOKENS_COLORS.L_MIRROR);
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.L_MIRRORED, ROTATION_STATES.UP);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW - rowidx, TETRIS_TOKENS_COLORS.L_MIRROR);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.L_MIRRORED, ROTATION_STATES.UP);;
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 1;
      const rowidx = row + 2;
      const free_cellidx = Cell_get_free_cell();

      if (free_cellidx !== INT_NULL) {

         const mesh = _cells_buffer.buffer[free_cellidx].mesh;

         Cell_reset_mesh(mesh, colidx, rowidx, TETRIS_TOKENS_COLORS.L_MIRROR);
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.L_MIRRORED, ROTATION_STATES.UP);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW - rowidx, TETRIS_TOKENS_COLORS.L_MIRROR);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.L_MIRRORED, ROTATION_STATES.UP);;
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
}
/** */
function Tetris_create_token_line4(section, token) {

   {
      const colidx = 1;
      const rowidx = TOP_ROW;
      const free_cellidx = Cell_get_free_cell();

      if (free_cellidx !== INT_NULL) {

         const mesh = _cells_buffer.buffer[free_cellidx].mesh;

         Cell_reset_mesh(mesh, colidx, rowidx, TETRIS_TOKENS_COLORS.LINE);
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.LINE, ROTATION_STATES.UP);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW - rowidx, TETRIS_TOKENS_COLORS.LINE);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.LINE, ROTATION_STATES.UP);;
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 1;
      const rowidx = TOP_ROW + 1;
      const free_cellidx = Cell_get_free_cell();

      if (free_cellidx !== INT_NULL) {

         const mesh = _cells_buffer.buffer[free_cellidx].mesh;

         Cell_reset_mesh(mesh, colidx, rowidx, TETRIS_TOKENS_COLORS.LINE);
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.LINE, ROTATION_STATES.UP);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW - rowidx, TETRIS_TOKENS_COLORS.LINE);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.LINE, ROTATION_STATES.UP);;
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 1;
      const rowidx = TOP_ROW + 2;
      const free_cellidx = Cell_get_free_cell();

      if (free_cellidx !== INT_NULL) {

         const mesh = _cells_buffer.buffer[free_cellidx].mesh;

         Cell_reset_mesh(mesh, colidx, rowidx, TETRIS_TOKENS_COLORS.LINE);
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.LINE, ROTATION_STATES.UP);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW - rowidx, TETRIS_TOKENS_COLORS.LINE);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.LINE, ROTATION_STATES.UP);;
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 1;
      const rowidx = TOP_ROW + 3;
      const free_cellidx = Cell_get_free_cell();

      if (free_cellidx !== INT_NULL) {

         const mesh = _cells_buffer.buffer[free_cellidx].mesh;

         Cell_reset_mesh(mesh, colidx, rowidx, TETRIS_TOKENS_COLORS.LINE);
         token.AddCell(free_cellidx, colidx, rowidx, TOKEN_TYPE.LINE, ROTATION_STATES.UP);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW - rowidx, TETRIS_TOKENS_COLORS.LINE);
         token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.LINE, ROTATION_STATES.UP);;
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
}
/** */
function Tetris_create_token_line2(section, token) {

   {
      const colidx = 1;
      const rowidx = TOP_ROW;
      const free_cellidx = Cell_get_free_cell();

      if (free_cellidx !== INT_NULL) {

         const mesh = _cells_buffer.buffer[free_cellidx].mesh;

         mesh.geom.pos[0] = 10 + (TOKEN_SIZE * 2 * colidx);
         mesh.geom.pos[1] = 10 + (TOKEN_SIZE * 2 * (TOP_ROW - rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0] + TOKEN_SIZE, mesh.geom.pos[1] + TOKEN_SIZE);

         token.AddCell(free_cellidx, colidx, rowidx);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW - rowidx);
         token.AddCell(cell.idx, colidx, rowidx);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
   {
      const colidx = 1;
      const rowidx = TOP_ROW + 1;
      const free_cellidx = Cell_get_free_cell();

      if (free_cellidx !== INT_NULL) {

         const mesh = _cells_buffer.buffer[free_cellidx].mesh;

         mesh.geom.pos[0] = 10 + (TOKEN_SIZE * 2 * colidx);
         mesh.geom.pos[1] = 10 + (TOKEN_SIZE * 2 * (TOP_ROW - rowidx));
         Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0] + TOKEN_SIZE, mesh.geom.pos[1] + TOKEN_SIZE);

         token.AddCell(free_cellidx, colidx, rowidx);
      }
      else {
         // Create new cells
         const cell = Cell_create(colidx, TOP_ROW - rowidx);
         token.AddCell(cell.idx, colidx, rowidx);
         section.AddItem(cell.mesh);
         cell.mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, section.gfx.vb.groupidx);
         cell.mesh.Render();
      }
   }
}



/** */
const token_cycle = [Tetris_create_token_line4, Tetris_create_token_shape_L_mirror, Tetris_create_token_shape_L, Tetris_create_token_square]

let cycle_cnt = 0;
/** */
const token_cycle_len = token_cycle.length - 1;
/** */
function Tetris_create_token(token_id, section) {

   const token = curr_token;
   token.Reset();

   const Create_token = token_cycle[cycle_cnt];
   cycle_cnt++;
   if (cycle_cnt > token_cycle_len) cycle_cnt = 0;
   Create_token(section, token)

   curr_token = token;
   speed = def_speed;

}
/** */
const scale_down = 1.;
/** */
function Tetris_start_menu(section_, emitter_) {


   const dim = [
      (VIEWPORT.WIDTH / 2 >= 180) ? 180 : VIEWPORT.WIDTH / 2 - 10,
      (VIEWPORT.HEIGHT / 2 >= 250) ? 250 : VIEWPORT.HEIGHT / 2 - 10,
   ];

   let zpos = 10;
   const r_corners = 20;

   const menu_panel = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, _, [20, 20], [VIEWPORT.WIDTH / 2, Mesh_get_real_pos_y(section_), 10], [0, 0], TRANSPARENCY(GREY[3], .9), 'section',);
   menu_panel.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu_panel.EnableGfxUniforms({ unif: SID.UNIF.U_SCALE_VEC2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);

   menu_panel.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
   menu_panel.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
   menu_panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);

   menu_panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

   menu_panel.SetName('MenuLoadPanel');

   menu_panel.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;

   zpos++;




   /*************************************************************************************************/
   // Menu Options

   const btn_col = TRANSPARENCY(GREEN[5], .8);

   // Calculate dimentions for small width device
   const dif = Abs((VIEWPORT.WIDTH / 2 - 10) - dim[0]);
   let log = (dif > 0) ? Math.log(dif) : .2;
   (log > 1) ? log = 1 : log = log;
   const pad = (30 * log)

   const tr = .3;
   const col_inner = GREY[0];

   const play_contols_info = Create_rect_mesh(_, _, [10, 10], [0, 0, 10], [0, 0], TRANSPARENCY(GREEN[5], .9), 'section',);
   play_contols_info.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   play_contols_info.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
   play_contols_info.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
   play_contols_info.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
   play_contols_info.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   menu_panel.AddItem(play_contols_info);

   {
      const info = Create_rect_mesh(_, _, [10, 10], [0, 0, 10], [0, 0], TRANSPARENCY(col_inner, tr), 'section',);
      // const info = Create_rect_mesh(_, _, [10,10], [0, 0, 10], [100,10], TRANSPARENCY(BLUE[9], 1.3), 'section', );
      info.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // info.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      info.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      info.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      info.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENT | SECTION.EXPAND;
      play_contols_info.AddItem(info);

      const col = PURPLER[7];
      const ctrl = Create_widget_label(_, 'A', _, _, _, col, WHITE, [11, 6], _, _, TEXTURES.CONSOLAS_32px);
      ctrl.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      ctrl.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 31);
      ctrl.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      info.AddItem(ctrl);

      const expl = Create_widget_label(_, 'Rotate Left', _, _, _, TRANSPARENCY(GREY[4], 0), WHITE, [10, 4], _, _, TEXTURES.CONSOLAS_24px);
      expl.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      expl.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      expl.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      info.AddItem(expl);
   }
   {
      const info = Create_rect_mesh(_, _, [10, 10], [0, 0, 10], [0, 0], TRANSPARENCY(col_inner, tr), 'section',);
      info.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      info.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      info.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      info.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENT | SECTION.EXPAND;
      play_contols_info.AddItem(info);

      const col = PURPLEB[9];
      const ctrl = Create_widget_label(_, 'D', _, _, _, col, WHITE, [12, 6], _, _, TEXTURES.CONSOLAS_32px);
      ctrl.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      ctrl.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      ctrl.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 32);
      info.AddItem(ctrl);

      const expl = Create_widget_label(_, 'Rotate Right', _, _, _, TRANSPARENCY(GREY[4], 0), WHITE, [10, 4], _, _, TEXTURES.CONSOLAS_24px);
      expl.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      expl.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      expl.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      info.AddItem(expl);

   }
   {
      const info = Create_rect_mesh(_, _, [10, 10], [0, 0, 10], [0, 0], TRANSPARENCY(col_inner, tr), 'section',);
      info.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      info.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      info.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      info.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENT | SECTION.EXPAND;
      play_contols_info.AddItem(info);

      const col = BLUEL[9];
      const ctrl = Create_widget_label(_, '<', _, _, _, col, WHITE, [11, 6], _, _, TEXTURES.CONSOLAS_32px);
      ctrl.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      ctrl.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      ctrl.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 31);
      info.AddItem(ctrl);

      const expl = Create_widget_label(_, 'Move Left', _, _, _, TRANSPARENCY(GREY[4], 0), WHITE, [10, 4], _, _, TEXTURES.CONSOLAS_24px);
      expl.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      expl.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      expl.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      info.AddItem(expl);
   }
   {
      const info = Create_rect_mesh(_, _, [10, 10], [0, 0, 10], [0, 0], TRANSPARENCY(col_inner, tr), 'section',);
      info.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      info.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      info.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      info.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENT | SECTION.EXPAND;
      play_contols_info.AddItem(info);

      const col = BLUEL[9];
      const ctrl = Create_widget_label(_, '>', _, _, _, col, WHITE, [12, 6], _, _, TEXTURES.CONSOLAS_32px);
      ctrl.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      ctrl.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      ctrl.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 32);
      info.AddItem(ctrl);

      const expl = Create_widget_label(_, 'Move Right', _, _, _, TRANSPARENCY(GREY[4], 0), WHITE, [10, 4], _, _, TEXTURES.CONSOLAS_24px);
      expl.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      expl.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      expl.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      info.AddItem(expl);

   }
   {
      const info = Create_rect_mesh(_, _, [10, 10], [0, 0, 10], [0, 0], TRANSPARENCY(col_inner, tr), 'section',);
      info.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      info.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      info.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      info.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENT | SECTION.EXPAND;
      play_contols_info.AddItem(info);

      const col = YELLOW[7];
      const ctrl = Create_widget_label(_, 'V', _, _, _, col, WHITE, [12, 6], _, _, TEXTURES.CONSOLAS_32px);
      ctrl.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      ctrl.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      ctrl.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 32);
      info.AddItem(ctrl);

      const expl = Create_widget_label(_, 'Move Down', _, _, _, TRANSPARENCY(GREY[4], 0), WHITE, [10, 4], _, _, TEXTURES.CONSOLAS_24px);
      expl.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      expl.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      expl.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      info.AddItem(expl);

   }

   play_contols_info.options = SECTION.RESIZE_PARENT | SECTION.VERTICAL;




   /*******************************************************************************************/
   // Start Game button
   const start_btn = Create_widget_close_btn(_, menu_panel, 'PLAY', [0, 0, zpos], 30, btn_col, WHITE, [dim[0] / 2 - pad * 2, 10], _, _, TEXTURES.CONSOLAS_32px);
   start_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   start_btn.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
   start_btn.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
   start_btn.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, start_btn.geom.dim[1]);
   start_btn.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   start_btn.SetName('start_btn');
   menu_panel.AddItem(start_btn);



   /*************************************************************************************************/
   // Render Menu 
   menu_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);
   menu_panel.GenGfxCtx();

   menu_panel.Calc_no_gfx_update();

   menu_panel.MoveNoGfxUpdate(-menu_panel.geom.dim[0], 0,);
   start_btn.MoveNoGfxUpdate(
      (menu_panel.geom.pos[0] - start_btn.geom.pos[0]) + (menu_panel.geom.dim[0] - start_btn.geom.dim[0]),
      (menu_panel.geom.pos[1] - start_btn.geom.pos[1]) + (menu_panel.geom.dim[1] * 2 - (start_btn.geom.dim[1] * 2 + 10)),
   );
   play_contols_info.MoveNoGfxUpdate(
      (menu_panel.geom.pos[0] - play_contols_info.geom.pos[0]) + (menu_panel.geom.dim[0] - play_contols_info.geom.dim[0]),
      0,
   );

   menu_panel.Render();


   Root_group_activate_all_vbs_in_renderqueue(menu_panel.root_bufferidx);
   Construct_listen_events_from_mesh_tree(menu_panel);
   Construct_listen_events_relations_from_mesh_tree(menu_panel);

   menu_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, menu_panel.gfx.vb.groupidx);
   menu_panel.GfxUniformSetAndUpdate('u_scale2', [scale_down, 1]);

   // Set menu in focus
   Mesh_set_root_in_focus(menu_panel.root_bufferidx, menu_panel.scroller_comp_idx);


   // Create event callback for the close menu button
   const evt_clbk_params = {
      evt_clbks: () => {

         // Create Tetris Game Loop
         const params = {
            section: section_,
            emitter: emitter_,
         }

         game_loop_time_interval_idx = Time_intervals_create(1, 'Tetris', TIME_INTERVAL_REPEAT_ALWAYS, Tetris_game_loop, params);
      },
   }

   Mesh_event_callback_create(menu_panel, evt_clbk_params);

}


/** */
export function Tetris(root_widget = 0x0, x, y, is_activated_by_demo_ = false, activation_id_) {

   /*************************************************************************************************/
   // Create the columns to store any
   Tetris_initialize_grid();

   tetris_panel_posx = x;
   tetris_panel_posy = y;
   is_activated_by_demo = is_activated_by_demo_;
   activation_id = activation_id_;


   const section = Create_rect_mesh(root_widget, _, [10, 10], [VIEWPORT.WIDTH / 2 - (TETRIS_PANEL_WIDTH + tetris_panel_pad), y, 0], [(TETRIS_PANEL_WIDTH + tetris_panel_pad), TETRIS_PANEL_HEIGHT + tetris_panel_pad], GREY[0], 'TetrisSection');
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.EnableGfxUniforms({ unif: SID.UNIF.U_SCALE_VEC2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);

   section.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 20);
   section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);


   // Create token
   const token = new Token();

   const row = DEBUG_NOT_MOVE_DOWN ? TOP_ROW / 2 : TOP_ROW;
   const col = DEBUG_NOT_MOVE_DOWN ? MAX_COLUMNS / 2 : 2;
   {
      const colidx = col;
      const rowidx = row;
      const cell = Cell_create(colidx, TOP_ROW - rowidx, TETRIS_TOKENS_COLORS.RECT);
      token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.LINE);
      section.AddItem(cell.mesh);
      curr_token = token;
   }
   {
      const colidx = col;
      const rowidx = row + 1;
      const cell = Cell_create(colidx, TOP_ROW - rowidx, TETRIS_TOKENS_COLORS.L);
      token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.LINE);
      section.AddItem(cell.mesh);
      curr_token = token;
   }
   {
      const colidx = col;
      const rowidx = row + 2;
      const cell = Cell_create(colidx, TOP_ROW - rowidx, TETRIS_TOKENS_COLORS.LINE);
      token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.LINE);
      section.AddItem(cell.mesh);
   }
   {
      const colidx = col;
      const rowidx = row + 3;
      const cell = Cell_create(colidx, TOP_ROW - rowidx, TETRIS_TOKENS_COLORS.L_MIRROR);
      token.AddCell(cell.idx, colidx, rowidx, TOKEN_TYPE.LINE);
      section.AddItem(cell.mesh);
   }


   curr_token = token;




   /*************************************************************************************************/
   // Render Section 
   section.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
   section.GenGfxCtx();
   section.Render();


   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   Construct_listen_events_from_mesh_tree(section);
   Construct_listen_events_relations_from_mesh_tree(section);

   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);
   section.GfxUniformSetAndUpdate('u_scale2', [scale_down, 1]);


   // Create Tetris Game Loop
   const emitter = Particles_explosion();


   // Bind Keyboard Controls
   Input_keyboard_bind_keydown_callback(Keyboard_input_keydown);
   Input_keyboard_bind_keyup_callback(Keyboard_input_keyup);

   Tetris_start_menu(section, emitter);
}
/** */
function Tetris_game_loop(params) {

   if (in_remove_row_animation) return;

   const section = params.params.section;

   const token = curr_token;

   const movey = speed;

   let has_collide = false;

   if (!DEBUG_NOT_MOVE_DOWN) {

      token.MoveDown(movey);

   }

   token.UpdatePos();

   // Token mesh with grid bottom collision
   if (token.lower_row_idx <= 0) {

      has_collide = true;
   }
   // Check collision with grid cells
   else {

      for (let i = 0; i < token.num_cells; i++) {

         // The column index taken from the token's cols buffer
         const col_idx = token.cols[i];

         const any_active = _grid_columns.buffer[col_idx].active_count;
         if (any_active > 0) {

            const col_top_elem = _grid_columns.buffer[col_idx].boundary;

            const row_idx = token.rows[i];
            if (col_top_elem === row_idx - 1) {
               has_collide = true;
               break;
            }
         }
      }
   }





   // Resolve Collision
   if (has_collide) {

      // Create pound animation
      const section_bot = section.geom.pos[1] + section.geom.dim[1] * 2;
      for (let i = 0; i < token.cells.boundary; i++) {

         Create_pound_animation(token, section_bot);
      }

      const emitter = params.params.emitter;
      Grid_add_cells_from_token(token);

      // END the game
      if (tetris_end) {
         Tetris_end(section, emitter);
         return;
      }

      if (DEBUG_PRINT) {
         console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$\nAfter token is added to grid')
         Debug_print()
      }


      // Store tokens rows that have a cell, for the check_row_completion before token reset 
      const token_cells_rows = [];
      for (let k = 0; k < token.rows.length; k++) {

         if (token.rows[k] !== INT_NULL) {

            // Add only unique rows, starting from index 1 of course
            if (k > 0) {
               const exists = Gen_array_check_for_existing_element(token_cells_rows, token.rows[k])
               if (!exists) token_cells_rows.push(token.rows[k]);
            }
            else token_cells_rows.push(token.rows[k]);
         }
      }

      Tetris_create_token(TETRIS_TOKEN_IDS.LINE, section);
      Grid_check_row_completion(token_cells_rows, emitter);

   }

}
/** */
export function Tetris_reset() {

   _grid_columns.ResetFull();
   _cells_buffer.ResetFull();
   _free_cells_buffer.Reset();

   complete_rows_cell_idxs = [];
   complete_rows_idxs = [];

   in_remove_row_animation = false;
   tetris_end = false;
   game_loop_time_interval_idx = INT_NULL;

   for (let i = 0; i < helper_arr_new_row.length; i++) {

      helper_arr_new_col[i] = INT_NULL;
      helper_arr_new_row[i] = INT_NULL;
   }

   Callback_animations_destroy();

}
/** */
function Tetris_end(section, emitter) {

   if (DEBUG_PRINT) console.log('------------------------------- END -------------------------------');

   // Grey out token

   Time_intervals_destroy_byidx(game_loop_time_interval_idx);

   for (let i = MAX_TOKENS_IN_Y_AXIS - 1; i >= 0; i--) {

      for (let j = 0; j < MAX_COLUMNS; j++) {

         if (_grid_columns.buffer[j].buffer[i] !== INT_NULL) {

            const params = {
               cell_col_idx: j,
               cell_row_idx: i,
               all_rgb_black: 0x0,
               section: section,
               emitter: emitter,

            };
            Callback_animations_create(Animation_end_game, Animation_end_game_stop, params, 'TetrisEndAnimation');

            return;
         }
      }
   }

}




/** */
function Animation_end_game(params) {

   const col_idx = params.cell_col_idx;
   const row_idx = params.cell_row_idx;


   const cell_idx = _grid_columns.buffer[col_idx].buffer[row_idx];
   if (cell_idx !== INT_NULL) {

      const cell = _cells_buffer.buffer[cell_idx];

      const mesh = cell.mesh;

      // Color Intensity animation
      const mod = 0.1;
      const c = 0.25;
      let r = mesh.mat.col[0];
      let g = mesh.mat.col[1];
      let b = mesh.mat.col[2];

      if (r > mod) r -= c;
      else
         params.all_rgb_black |= 0x1;
      if (g > mod) g -= c;
      else
         params.all_rgb_black |= 0x2;
      if (b > mod) b -= c;
      else
         params.all_rgb_black |= 0x4;

      mesh.mat.col[0] = r;
      mesh.mat.col[1] = g;
      mesh.mat.col[2] = b;

      Gl_set_rgb(mesh.gfx, mesh.mat.col, 1);


   }

   if (params.all_rgb_black === (0x1 | 0x2 | 0x4)) {
      return false;
   }

   return true;
}
/** */
function Animation_end_game_stop(params_) {

   const col_idx = params_.cell_col_idx;
   const row_idx = params_.cell_row_idx;

   let col_continue = col_idx + 1;

   for (let i = row_idx; i >= 0; i--) {

      for (let j = col_continue; j < MAX_COLUMNS; j++) {

         if (_grid_columns.buffer[j].buffer[i] !== INT_NULL) {

            const valid_cell_idx = _grid_columns.buffer[j].buffer[i];

            if (valid_cell_idx !== INT_NULL) {

               const params = {
                  cell_col_idx: j,
                  cell_row_idx: i,
                  all_rgb_black: 0x0,
                  section: params_.section,
                  emitter: params_.emitter,

               };

               Callback_animations_create(Animation_end_game, Animation_end_game_stop, params, 'TetrisEndAnimation');


               return false;
            }
         }
      }

      col_continue = 0
   }

   Tetris_reset();
   App_reset(); // Reset all 
   Scene_camera_scroll_set(_, 0);
   App_reinitialize();

   if (is_activated_by_demo) Demo_page(activation_id);
   else Tetris(ROOT_WIDGETS.CREATE_ROOT, tetris_panel_posx, tetris_panel_posy, false, activation_id);

   return false;
}








/******************************************************************************************************************************/
// Animations

// Pound Animation
/** */
function Create_pound_animation(token, target_posy) {

   // store all cell's meshes, because the token will have been changed by the time the animation callback will execute

   let complete_rows_cell_idxs = [];
   for (let i = 0; i <= token.cells.boundary; i++) {
      if (token.cells.buffer[i] !== INT_NULL)
         complete_rows_cell_idxs.push(token.cells.buffer[i]);
   }

   const params = {
      complete_rows_cell_idxs: complete_rows_cell_idxs,
      target_posy: target_posy,
      posy_limit: 3,
      anim_dir: -1, // animation's direction
      thershold: 2, // The threshold of the least posy_limit value in pixels to exit animation
   };

   Callback_animations_create(Animation_pound_run, Animation_pound_stop, params);
}
/** */
function Animation_pound_run(params) {

   const complete_rows_cell_idxs = params.complete_rows_cell_idxs;
   const anim_dir = params.anim_dir;
   const thershold = params.thershold;

   const y = 1 * anim_dir;

   const len = complete_rows_cell_idxs.length;
   for (let i = 0; i < len; i++) {
      const mesh = _cells_buffer.buffer[complete_rows_cell_idxs[i]].mesh;
      // mesh.geom.pos[1] += y;
      Gl_add_wpos_y(mesh.gfx, y, 1);
   }

   params.posy_limit *= .9;
   // Stop animation when a certain threshold has been reached
   if (params.posy_limit < thershold)
      return false

   return true;

}
/** */
function Animation_pound_stop(params) {

   const complete_rows_cell_idxs = params.complete_rows_cell_idxs;
   const target_posy = params.target_posy;

   const len = complete_rows_cell_idxs.length;
   for (let i = 0; i < len; i++) {
      const mesh = _cells_buffer.buffer[complete_rows_cell_idxs[i]].mesh;
      // mesh.geom.pos[1] = target_posy;
      // Gl_set_wpos_y(mesh.gfx, target_posy, 1);
      Gl_set_wpos_y(mesh.gfx, mesh.geom.pos[1], 1);
   }

   return false;
}



/******************************************************************************************************************************/
// Create Remove Row Animation
/** */
function Create_row_animation(complete_rows_cell_idxs, rowidxs, emitter) {


   in_remove_row_animation = true;

   // Create scale animation
   const params = {
      rowidxs: rowidxs,
      all_rgb_maxed: 0x0,
      emitter: emitter,
      cell_buffer_idx: 0,
   };

   Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params, 'TetrisScaleAnimation');
}




/******************************************************************************************************************************/
// Scale animation
/** */
function Animation_scale_up_run(params) {

   const cell_buffer_idx = params.cell_buffer_idx;
   const cell_idx = complete_rows_cell_idxs[cell_buffer_idx];

   const cell = _cells_buffer.buffer[cell_idx];
   const slope_constant = init_slope;
   const prev_slope_val = cell.prev_slope_val;
   const scale = cell.scale;


   cell.time += cell.time_step;
   const slope = Logarithmic_interpolation(cell.time, slope_constant);

   const mesh = cell.mesh;
   const size = -(slope - prev_slope_val) * scale;

   { // Scale Up animation
      mesh.geom.dim[0] += size;
      mesh.geom.dim[1] += size;
      mesh.geom.AddDimXY(mesh.gfx, size, size);
      Gl_add_dim_xy(mesh.gfx, size, size);
   }

   { // Color Intensity animation
      const c = .03;
      let r = mesh.mat.col[0];
      let g = mesh.mat.col[1];
      let b = mesh.mat.col[2];

      if (r <= 1.0) r += c;
      else params.all_rgb_maxed |= 0x1;
      if (g <= 1.0) g += c;
      else params.all_rgb_maxed |= 0x2;
      if (b <= 1.0) b += c;
      else params.all_rgb_maxed |= 0x4;

      mesh.mat.col[0] = r;
      mesh.mat.col[1] = g;
      mesh.mat.col[2] = b;

      Gl_set_rgb(mesh.gfx, mesh.mat.col, 1);
   }


   if (mesh.sid.attr & SID.ATTR.R_CORNERS) {

      const roun_orig = cell_round_corners;
      const roun_circle = mesh.geom.dim[0] * slope;

      // Interpolate between original roundess and circle roundess
      const roundness = (roun_orig * (1.4 - slope)) + (roun_circle);

      mesh.mat.style.rcorners = roundness;
      Gl_set_attr_round_corners(mesh.gfx, mesh.mat.style.rcorners);
   }

   cell.prev_slope_val = slope;


   // Create scale up for the next cell mesh
   const next_cell_idx = cell_buffer_idx + 1;
   const next = complete_rows_cell_idxs[next_cell_idx]; // Get the next cell index from the 
   const next_cell = _cells_buffer.buffer[next];
   if (next_cell_idx < complete_rows_cell_idxs.length) {
      if (slope > cell.next_anim_start && !next_cell.in_animation) {

         // Set the next cell in animation mode
         next_cell.in_animation = true;

         // Create animation for next cell
         const params2 = {
            rowidxs: params.rowidxs,
            emitter: params.emitter,
            cell_buffer_idx: next_cell_idx,
         };

         Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params2);
      }
   }

   const rows_num = params.rowidxs.length;
   const speed_mod = rows_num === 1 ? .15 : (rows_num * .1);

   // if (slope < .75) return true;
   if (slope < 1 - speed_mod) return true;
   else return false

}
/** */
function Animation_scale_up_stop(params) {

   const cell_buffer_idx = params.cell_buffer_idx;
   const cell_idx = complete_rows_cell_idxs[cell_buffer_idx];
   const cell = _cells_buffer.buffer[cell_idx];
   // Reset Cell's properties
   cell.time = 0;
   cell.prev_slope_val = 0;
   cell.in_animation = false;

   const section = cell.mesh.parent;
   const section_posx = Mesh_get_real_pos_x(section);

   // Reset mesh's properties
   const mesh = cell.mesh;
   mesh.geom.pos[1] = OUT_OF_VIEW;
   Gl_set_wpos_y(mesh.gfx, OUT_OF_VIEW);


   // Particles Emitter
   const emitter = params.emitter;
   const posy = Grid_get_posy_from_rowidx(cell.rowidx);
   const posx = section_posx + Grid_get_posx_from_colidx(cell.colidx);

   emitter.geom.pos[0] = posx + tetris_panel_posx;
   emitter.geom.pos[1] = posy + tetris_panel_posy + TOKEN_SIZE;

   emitter.mat.col[0] = mesh.mat.defCol[0];
   emitter.mat.col[1] = mesh.mat.defCol[1];
   emitter.mat.col[2] = mesh.mat.defCol[2];
   emitter.mat.col[3] = mesh.mat.defCol[3];

   const emitter_idx = emitter.idx;
   const emitter_params = { params: { target_params: [emitter_idx] }, };
   Particle_system_emitt(emitter_params);



   // Remove cell rows
   const last_elem_idx = complete_rows_cell_idxs.length - 1;
   if (cell_buffer_idx === last_elem_idx) {

      const rowidxs = params.rowidxs;
      const boundary = rowidxs.length - 1;

      for (let i = boundary; i >= 0; i--) {

         if (DEBUG_PRINT) console.log('Removing Row:', rowidxs[i])
         Grid_remove_row(rowidxs[i]);
      }

      Grid_move_all_down(rowidxs);

      if (DEBUG_PRINT) {
         console.log('#############################################################################################\nAfter grid row has been removed')
         Debug_print()
      }

      // Reset completed rows buffer
      in_remove_row_animation = false;
      complete_rows_cell_idxs = [];
      complete_rows_idxs = [];

      if (DEBUG_PRINT) console.log('complete_rows_cell_idxs', complete_rows_cell_idxs, 'complete_rows_idxs', complete_rows_idxs);
   }


   return false;
}




/******************************************************************************************************************************/
// Explosion particles
/** */
export function Particles_explosion(x = 0, y = 0, num_particles_per_frame = 4) { // 3 control Sliders 

   const scale_down = 1.;



   /****************************************************************************************************************/
   // Create Particles Particles Emitter
   const particles_size = 30;
   num_particles_per_frame = 128;

   const emitter_idx = Particle_system_create_emitter('Particle System Glow Emitter', BLUEL[9], [x, y, 10], [particles_size, particles_size], .03, 1, 4, .98, .1, 4, _, num_particles_per_frame);
   const emitter = Particles_get_particle_system(emitter_idx);
   emitter.EnableProperties(PARTICLES.HAS_RANDOM_POLAR_COORD);
   emitter.EnableProperties(PARTICLES.HAS_JIGGLE, { jigglex: 4, jiggley: 3 });

   emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
   emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME, 0);
   emitter.EnableGfx(SID.SHAD.FN_GLOW);

   emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, particles_size);
   emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

   emitter.EnableGfx(SID.SHAD.FN_EXPLOSION_CIRCLE);
   emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_GENERIC_VEC2, { a: 0.01, b: 0.0 });


   emitter.EnableGfxUniforms({ unif: SID.UNIF.U_SCALE_VEC2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
   emitter.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 3);

   emitter.SetConeOfDirection(-.1, .1, .1, -.1);

   Particles_gen_gfx_ctx(emitter,);


   // Set callback for uniform update
   emitter.GfxUniformSetAndUpdate('u_scale2', [scale_down, 1,]);
   emitter.GfxUniformSetAndUpdate('u_generic_controls', [1., 1, .2]);


   /****************************************************************************************************************/
   // Create Smoke Particles
   // const particles_size = 5;
   // num_particles_per_frame=4;

   // const emitter_idx = Particle_system_create_emitter('Particle System Glow Emitter', BLUEL[9], [x, y, 10], [particles_size, particles_size], .014, 1, 1, .96, -.1, 3, TEXTURES.SMOKE_1, num_particles_per_frame);
   // const emitter = Particles_get_particle_system(emitter_idx);

   // emitter.EnableProperties(PARTICLES.HAS_START_POS_VARIATION);
   // emitter.EnableProperties(PARTICLES.HAS_ROTATION);
   // emitter.EnableProperties(PARTICLES.HAS_SCALE, 14);
   // emitter.speed = .8;

   // emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME);
   // emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
   // emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_TEX2);

   // emitter.SetConeOfDirection(-.1, .1, .1, -.1);

   // Particles_gen_gfx_ctx(emitter, );






   { // SHADER UNIFORMS: Distance
      const val = .5;
      const val_idx = 0;
      // Find the ubidx
      // const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_glow_params');
      const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_generic_controls');
      Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, val, val_idx);
   }
   { // SHADER UNIFORMS: Brightness
      const val = 0.0;
      const val_idx = 1;
      // Find the ubidx
      const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_generic_controls');
      Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, val, val_idx);
   }
   { // SHADER UNIFORMS: Intensity
      // const val = 0.05;
      const val = 0.15;
      const val_idx = 2;
      // Find the ubidx
      const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_generic_controls');
      Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, val, val_idx);
   }
   { // SHADER UNIFORMS: Particle Scale
      const val = 0.08;
      const val_idx = 0;
      // Find the ubidx
      const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_scale2');
      Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, val, val_idx);
   }
   { // Gravity
      const val = 0.;
      emitter.gravity = val;
   }
   { // Acceleration
      const val = 10.0;
      emitter.accel = val;
   }
   { // Deccelerarion
      const val = .98;
      emitter.deccel = val;
   }

   return emitter;

}





























function Debug_print() {
   console.log('------------------------------------------------------------------------------------',)

   for (let j = MAX_TOKENS_IN_Y_AXIS - 1; j >= 0; j--) {


      // let row = [-1,-1,-1,-1]
      let row = []
      let cnt = 0;
      let print = false;

      for (let i = 0; i < MAX_COLUMNS; i++) {

         const col = _grid_columns.buffer[i];

         if (col.buffer[j] !== INT_NULL) {
            row[cnt] = 'o';
            print = true
         }
         else row[cnt] = ' ';

         cnt++;
      }

      console.log('row', j, ':', row);

   }


   const active_count = [], boundary = [];

   for (let i = 0; i < MAX_COLUMNS; i++) {

      const col = _grid_columns.buffer[i];
      boundary.push(`${col.boundary}`);
      active_count.push(`${col.active_count}`);

   }
   console.log('---------\nboundar', boundary)
   console.log('active_', active_count)


   console.log('!!!!!!!!!!!!!!!!!!!!!!!!!', _cells_buffer.buffer[12])

}