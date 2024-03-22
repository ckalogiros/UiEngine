"use strict";

import { Gl_set_alpha_from_offset } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { AddArr2, CopyArr2, CopyArr3, Floor } from "../../../Helpers/Math/MathOperations.js";
import { Batch_store } from "../../Batch/Batch.js";
import { MouseGetPosDif } from "../../Controls/Input/Mouse.js";
import { Create_widget_text } from "../../Core/CreateWidget.js";
import { Widget_group_add, Widget_group_update_decrement, Widget_group_update_increment, Widget_root_add_mesh } from "../../Core/MeshBuffer.js";
import { Font_get_font_advancex } from "../../Loaders/Font/ChlumskyFontMetricsLoader.js";
import { TimeIntervalsCreate, TimeIntervalsDestroyByIdx, TimeIntervalsGetByIdx } from "../../Timers/TimeIntervals.js";
import { WHITE } from "../Material/Base/Colors.js";
import { Text_Mesh } from "../Meshes/Text_Mesh.js";
import { Align_between, Align_self } from "../Operations/Alignment.js";



/**
 * 
 * // TODO: When we have to implement that the user decides for the font type (sdf...etc)
 * then the CalculateSdfOuterFromDim must:
 * 1. live in an if statement (if(fontType is sdf))
 * 2. move the function to the parent class instead of call it from all the children classes of Text_Mesh
 */
export class Widget_Text extends Text_Mesh {

	pad;

	constructor(text, pos, fontSize = 8, col = WHITE, bold = 4, pad = [0, 0]) {

		// const sdfouter = CalculateSdfOuterFromDim(fontSize);
		// if (sdfouter + bold > 1) bold = 1 - sdfouter;

		super(text, pos, fontSize, col)
		this.type |= MESH_TYPE.WIDGET_TEXT | this.type;

		// this.SetName(`[${this.mesh_bufferidx}]{${text}}-Widget-Text`);
		this.pad = [0, 0];
		AddArr2(this.pad, pad);
	}



	/*******************************************************************************************************************************************************/
	// Graphics


	Render() {

		this.AddToGfx();
	}


	Rerender() {

		this.AddToGfxFromReset();
	}

	AddToWidgetRootBuffer(root_bufferidx) {

		this.root_bufferidx = root_bufferidx;
		Widget_root_add_mesh(this.root_bufferidx, this.mesh_bufferidx);
	}



	/*******************************************************************************************************************************************************/
	// Alignment

	Align_pre(target_mesh, flags, pad = [0, 0]) { // Align pre-added to the vertexBuffers

		const pos = [0, 0];
		CopyArr2(pos, this.geom.pos);

		if (flags & ALIGN.LEFT) {

			const pos = [0, 0];
			CopyArr2(pos, this.geom.pos);

			// Vertical allignment
			pos[1] = target_mesh.geom.pos[1];

			// Horizontal allignment
			pos[0] = (target_mesh.geom.pos[0] - target_mesh.geom.dim[0]) + (this.geom.dim[0]) + pad[0];

			CopyArr2(this.geom.pos, pos);

		}
		else if (flags & ALIGN.RIGHT) {

			const pos = [0, 0];
			CopyArr2(pos, this.geom.pos);

			// Vertical allignment
			pos[1] = target_mesh.geom.pos[1];

			// Horizontal allignment
			const num_faces = (this.geom.num_faces - 1 > 1) ? this.geom.num_faces - 1 : 1;
			pos[0] = (target_mesh.geom.pos[0] + target_mesh.geom.dim[0]) - (this.geom.dim[0] * 2 * num_faces) - pad[0];

			CopyArr2(this.geom.pos, pos);

		}
	}


	Reposition_post(pos_dif) {

		this.MoveXYZ(pos_dif)
		for (let i = 0; i <= this.children.boundary; i++) {

			const child = this.children.buffer[i];
			child.MoveXYZ(pos_dif)
		}
	}


	Reposition_pre(pos_dif) {

		AddArr2(this.geom.pos, pos_dif)

		if (this.batch_fnidx === INT_NULL)
			this.batch_fnidx = BATCH_FN_IDX.ADD_WPOS4;

		const update_data = {
			sizes: [2],
			data: [pos_dif[0], pos_dif[1]],
		};
		Batch_store(this, SHADER_ATTRIBUTES.WPOS4, update_data, _);

		for (let i = 0; i <= this.children.boundary; i++) {

			const child = this.children.buffer[i];
			AddArr2(child.geom.pos, pos_dif);

			if (child.batch_fnidx === INT_NULL)
				child.batch_fnidx = BATCH_FN_IDX.ADD_WPOS4;

			Batch_store(child, SHADER_ATTRIBUTES.WPOS4, update_data, _);
			// Batch_store(child, _, { pos: pos_dif }, _);
		}
	}



	/*******************************************************************************************************************************************************/
	// Getters-Setters





	/*******************************************************************************************************************************************************/
	// Transformations


	ClampX(x, margin = 0) {

		const clamp = x - margin;
		// const clamp = x - margin*2;

		const char_width = Floor(this.fontsize * Font_get_font_advancex(this.mat.texidx)) * 2;
		let text_width = char_width;
		let k = 0; // Will store the number of characters need to be clamped.
		// Calculate how many characters we must ommit.
		while (text_width + char_width < clamp && k < this.geom.num_faces) {
			text_width += char_width;
			k++;
		}
		this.geom.num_faces = k;

		// Update the gfx buffers, if the mesh is already inserted.
		if (this.is_gfx_inserted) {
			// TODO: Here we decide if we rebuild the vertex buffer or just not draw the ommited text

			const ommited_chars = this.mat.text.length - this.geom.num_faces - 1;
			Gl_set_alpha_from_offset(this.gfx, 0, this.geom.num_faces - 1, ommited_chars); // Update alpha in text vertex buffer
			// Gl_set_alpha_from_offset(this.gfx, 0, this.geom.num_faces, this.geom.num_faces); // Update alpha in text vertex buffer
		}
	}


	SetZPos(val) {
		this.geom.pos[2] = val;
	}


	SetIsGfxInserted(flag) {
		if (this.is_gfx_inserted !== flag) this.is_gfx_inserted = flag; // If true then set false
	}


	Move(x, y) {

		if (x === 0 && y === 0) return;

		// this.geom.MoveXY(x, y, this.gfx);
		this.geom.pos[0] += x;
		this.geom.pos[1] += y;
		
		const update_data = {
         sizes: [2],
         data: [x,y],
      }
      Batch_store(this, _, update_data, _);
		// Batch_store(this, _, { pos: [x, y] });

	}


	FakeRemoveFromGfxPosy(posy) {

		this.geom.defPos[1] = this.geom.pos[1]; // Copy the current position to the mesh's default pos, so it can be retrieved.
		this.geom.SetPosY(posy, this.gfx);
	}


	FakeAddFromGfxPosy(posy) {

		this.geom.pos[1] = this.geom.defPos[1]; // Copy the current position to the mesh's default pos, so it can be retrieved.
		this.geom.SetPosY(posy, this.gfx);
	}


	FakeRemoveFromGfxAlpha(alpha) {

		this.mat.defCol[3] = this.mat.col[3];
		this.mat.SetColorAlpha(alpha, this.gfx);
	}


	FakeAddFromGfxAlpha(alpha) {

		this.mat.col[3] = this.mat.defCol[3];
		this.mat.SetColorAlpha(alpha, this.gfx);
	}


	AddToWidgetGroupBuffer(group_bufferidx) {

		if(group_bufferidx === INT_NULL)
         console.error('Catch group_bufferidx === -1. this:', this.GetName(), this)

		if (this.state.mask & MESH_STATE.ACTIVE) {
			this.group_bufferidxs[0] = group_bufferidx;
			this.group_bufferidxs[1] = Widget_group_add(group_bufferidx, this.gfx, this.geom.num_faces, this.mesh_bufferidx);
		}
	}


	Activate() {

		this.state.mask |= MESH_STATE.ACTIVE;
	}


	Deactivate() {

		this.state.mask &= ~MESH_STATE.ACTIVE;
	}


	UpdateWidgetGroupIncrementNumFaces() {

		Widget_group_update_increment(this.group_bufferidxs, this.geom.num_faces);
	}


	UpdateWidgetGroupDecrementNumFaces() {

		Widget_group_update_decrement(this.group_bufferidxs, this.geom.num_faces, this);
	}

}



export class Widget_Multi_Text extends Widget_Text {

	alignment = 0x0;

	/** Set the max number of characters for the dynamic text, by passing any text as 'dynamic_text' of length= dynamic text number of characters*/
	constructor(text, ALIGNMENT = ALIGN.HORIZONTAL, pos, fontSize, text_col, bold, pad) {

		super(text, pos, fontSize, text_col, bold, pad);
		this.type |= MESH_TYPE.WIDGET_TEXT_DYNAMIC;

		// Translate the dynamic text by the width of the constant text's width
		// pos[0] += this.geom.CalcTextWidth();

		// Default alignment for all children text meshes
		// this.alignment = ALIGN.VERTICAL;
		this.alignment = ALIGNMENT;
		// this.Align_pre(this, this.alignment)

	}


	Destroy() {

		for (let i = 0; i <= this.children.boundary; i++) {

			if (this.children.buffer[i]) {
				this.children.buffer[i].Destroy();
			}
		}

		return super.Destroy();
	}


	// NOTE: The Text_Mesh and Textured_Mesh classes don't have an AddItem() method.
	// TODO: Maybe add one ????
	AddChild(text_mesh) {

		text_mesh.idx = this.children.Add(text_mesh);
		text_mesh.parent = this;

		if (this.root_bufferidx !== INT_NULL && text_mesh.root_bufferidx === INT_NULL) {
			text_mesh.root_bufferidx = this.root_bufferidx;
			Widget_root_add_mesh(text_mesh.root_bufferidx, text_mesh.mesh_bufferidx);
		}

		// this.children_all.Add(text_mesh.mesh_bufferidx);

		// this.Align_pre(text_mesh, this.alignment)
		// this.Align_pre(this, this.alignment)
		return text_mesh.idx;
	}


	AddToWidgetRootBuffer(root_bufferidx) {

		this.root_bufferidx = root_bufferidx;
		Widget_root_add_mesh(this.root_bufferidx, this.mesh_bufferidx);

		for (let i = 0; i <= this.children.boundary; i++) {
			const child = this.children.buffer[i];
			child.root_bufferidx = root_bufferidx;
			Widget_root_add_mesh(child.root_bufferidx, child.mesh_bufferidx);
		}
	}


	Activate() {

		this.state.mask |= MESH_STATE.ACTIVE;
		for (let i = 0; i <= this.children.boundary; i++) {
			this.children.buffer[i].state.mask |= MESH_STATE.ACTIVE;
		}
	}


	Deactivate() {

		this.state.mask &= ~MESH_STATE.ACTIVE;
		for (let i = 0; i <= this.children.boundary; i++) {
			this.children.buffer[i].state.mask &= ~MESH_STATE.ACTIVE;
		}
	}


	StateEnable(MASK = 0x0) {

		this.state.mask |= MASK;
		for (let i = 0; i <= this.children.boundary; i++) {
			this.children.buffer[i].state.mask |= MASK;
		}
	}


	StateDisable(MASK = 0x0) {

		this.state.mask &= ~MASK;
		for (let i = 0; i <= this.children.boundary; i++) {
			this.children.buffer[i].state.mask &= ~MASK;
		}
	}


	ClipY(clip_top, clip_bottom) {

		if (this.ClipyCheck_A(clip_top, clip_bottom))
			this.state.mask &= ~MESH_STATE.ACTIVE;

		for (let i = 0; i <= this.children.boundary; i++) {
			if (this.children.buffer[i].ClipyCheck_A(clip_top, clip_bottom))
				this.children.buffer[i].state.mask &= ~MESH_STATE.ACTIVE;
		}
	}


	/*******************************************************************************************************************************************************/
	// GFX

	GenGfxCtx(FLAGS, gfxidx) {

		super.GenGfxCtx(FLAGS, gfxidx);

		// We know that the 'this' is of type text, so we use the same gfx buffer index for all children texts
		FLAGS |= GFX_CTX_FLAGS.SPECIFIC;
		const igfx = [this.gfx.prog.idx, this.gfx.vb.idx];

		for (let i = 0; i <= this.children.boundary; i++) {

			const child = this.children.buffer[i];
			// if (child) child.gfx = child.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, igfx); // Pass the already exixting gfx buffers for use
			if (child) child.gfx = child.GenGfxCtx(FLAGS, igfx); // Pass the already exixting gfx buffers for use

			// NOTE: The batch_buffer_vbidx for the parent text is created from the super.GenGfxCtx(). So we have to set it for all children from here.
			child.batch_buffer_vbidx = this.batch_buffer_vbidx;
		}
		return this.gfx;
	}


	Render() {

		super.Render();

		for (let i = 0; i <= this.children.boundary; i++) {

			const child = this.children.buffer[i];
			if (child) child.Render();
		}
	}


	Rerender() {

		super.Rerender();
		for (let i = 0; i <= this.children.boundary; i++) {

			const child = this.children.buffer[i];
			if (child) child.Rerender();
		}
	}



	/*******************************************************************************************************************************************************/
	// Setters-Getters

	/** Return type: Array. Returns an array of all widgets meshes */
	GetAllMeshes(parent_meshes_buf) {

		const all_meshes = parent_meshes_buf ? parent_meshes_buf : [];
		all_meshes.push(this);
		for (let i = 0; i <= this.children.boundary; i++) {

			const child = this.children.buffer[i];
			if (child) all_meshes.push(child);
		}
		return all_meshes;
	}


	GetMaxWidth() {

		let max_width = super.GetMaxWidth();

		if (this.alignment & ALIGN.HORIZONTAL) { // If the children text meshes are aligned horizontaly, acumulate all text meshes widths
			for (let i = 0; i <= this.children.boundary; i++) {
				max_width += this.children.buffer[i].GetMaxWidth() + this.children.buffer[i].pad[0];
			}
			return max_width;
		}
		else {
			for (let i = 0; i <= this.children.boundary; i++) {
				const w = this.children.buffer[i].GetMaxWidth() + this.children.buffer[i].pad[0];
				if (max_width < w)
					max_width = w;
			}
			return max_width;
		}

	}


	GetTotalHeight() {

		let max_height = this.geom.dim[1] + this.pad[1];

		// HACK: TODO: Set only one of both(SECTION or ALIGN) as global align bit field
		if (this.alignment & ALIGN.HORIZONTAL) { // If the children text meshes are aligned horizontaly, return the height of the 'this' text mesh height
			return max_height;
		}
		else { // Else calculate all the lines of the text meshes
			for (let i = 0; i <= this.children.boundary; i++) {
				max_height += this.children.buffer[i].geom.dim[1] + this.children.buffer[i].pad[1];
			}
			return max_height;
		}

	}


	SetColorAlpha(alpha) {

		super.SetColorAlpha(alpha);
		for (let i = 0; i <= this.children.boundary; i++) {
			this.children.buffer[i].SetColorAlpha(alpha);
		}
	}


	SetIsGfxInserted(flag) {
		if (this.is_gfx_inserted !== flag) this.is_gfx_inserted = flag; // If true then set false

		for (let i = 0; i <= this.children.boundary; i++) {
			if (this.children.buffer[i].is_gfx_inserted !== flag) this.children.buffer[i].is_gfx_inserted = flag;
		}
	}


	FakeRemoveFromGfxPosy(posy) {

		this.geom.defPos[1] = this.geom.pos[1]; // Copy the current position to the mesh's default pos, so it can be retrieved.
		super.SetPosY(posy);

		for (let i = 0; i <= this.children.boundary; i++) {
			this.children.buffer[i].geom.defPos[1] = this.children.buffer[i].geom.pos[1];
			this.children.buffer[i].SetPosY(posy);
		}
	}


	FakeAddFromGfxPosy(posy) {

		this.geom.pos[1] = this.geom.defPos[1]; // Copy the current position to the mesh's default pos, so it can be retrieved.
		super.SetPosY(posy);

		for (let i = 0; i <= this.children.boundary; i++) {
			this.children.buffer[i].geom.pos[1] = this.children.buffer[i].geom.defPos[1];
			this.children.buffer[i].SetPosY(posy);
		}
	}


	FakeRemoveFromGfxAlpha(alpha) {

		this.mat.defCol[3] = this.mat.col[3];
		this.mat.SetColorAlpha(alpha, this.gfx);

		for (let i = 0; i <= this.children.boundary; i++) {
			this.children.buffer[i].mat.defCol[3] = this.children.buffer[i].mat.col[3];
			this.children.buffer[i].mat.SetColorAlpha(alpha, this.gfx);
		}
	}


	FakeAddFromGfxAlpha(alpha) {

		this.mat.col[3] = this.mat.defCol[3];
		this.mat.SetColorAlpha(alpha, this.gfx);

		for (let i = 0; i <= this.children.boundary; i++) {
			this.children.buffer[i].mat.col[3] = this.children.buffer[i].mat.defCol[3];
			this.children.buffer[i].mat.SetColorAlpha(alpha, this.gfx);
		}
	}


	SetZPos(val) {
		this.geom.pos[2] = val;
		for (let i = 0; i <= this.children.boundary; i++) {
			this.children.buffer[i].geom.pos[2] = val;
		}
	}



	/*******************************************************************************************************************************************************/
	// 

	CreateNewText(dynamic_text, fontSize, text_col2, pad = [0, 0], bold = this.bold) {

		/** DEBUG ERROR*/ if (!Array.isArray(pad)) console.error('Pad is not of type array');

		let pos = [0, 0, 0];

		// Find the last text mesh.
		let prev_text_mesh = null;
		if (this.children.active_count) {

			prev_text_mesh = this.children.buffer[this.children.boundary];
			ERROR_NULL(prev_text_mesh, ' @ Widget_Dynamic_Text_Mesh.CreateNewText(). WidgetText.js');
		}
		else prev_text_mesh = this;

		CopyArr3(pos, this.geom.pos); // Copy the dynamic's text mesh pos
		const new_text = Create_widget_text(_, dynamic_text, pos, fontSize, text_col2, bold, pad);
		new_text.type = MESH_TYPE.WIDGET_TEXT_DYNAMIC;
		// Add the new new_text as a child of 'this'.
		const idx = this.AddChild(new_text);
		// new_text.SetName('MultiText '+ idx + '-' + new_text.mat.text.slice(0, 7));
		this.type |= MESH_TYPE.WIDGET_TEXT_DYNAMIC | new_text.geom.type | new_text.mat.type;


		// new_text.pad = prev_text_mesh.pad;


		// Align_self(ALIGN.LEFT, this.geom, new_text.geom, new_text.geom.num_faces, pad);
		// Align_between(ALIGN.VERTICAL, prev_text_mesh.geom, new_text.geom, pad, new_text.pad, prev_text_mesh.advancex)
		// Align_between(ALIGN.HORIZONTAL, prev_text_mesh.geom, new_text.geom, prev_text_mesh.pad, new_text.pad, prev_text_mesh.advancex)
		Align_between(this.alignment, prev_text_mesh.geom, new_text.geom, pad, new_text.pad, prev_text_mesh.advancex)
		const pos_dif = Align_self(this.alignment, this.geom, new_text.geom, pad, prev_text_mesh.advancex);
		// const pos_dif = Align_self(ALIGN.LEFT, this.geom, new_text.geom, pad, prev_text_mesh.advancex);
		AddArr2(new_text.geom.pos, pos_dif);


		return idx;
	}


	/**
	  * @param {integer} msInterval The time interval in ms the dynamic text will be updated
	  * @param {callbackfunction} func The function to call upon time interval
	  * See explanation at ##SetDynamicText
	  * TODO: The param "idx" does not make any sense anymore
	  */
	SetDynamicText(name, msInterval, func, func_params = null, idx = INT_NULL, custom_interval_idx = INT_NULL) {

		if (idx !== INT_NULL || (this.children.boundary <= 1) && custom_interval_idx === INT_NULL) {
			/**
			 * The this.children.boundary takes a snapshot of the children count upon this function call.
			 * The idea is: for example upon function call for the first time
			 * with one dynamic text mesh, the count=1. At this time the idx param is null,
			 * because it is the first call to the SetDynamicText() for this object instantiation.
			 * so we pass as param to the interval function, the whole buffer of children
			 * that currently have one mesh, that is the root multText mesh.
			 * 
			 * When the CreateNewText() is called to add a second multiText to 'this',
			 * we make a choise:
			 * 	1. Either we  create a new timeInterval for the new multiText.
			 * 	2. We use the same timeInterval from the first multiText (class instantiation).
			 * For the first case procedure is pretty much straight forward.
			 * For the second approach we destroy the timeInterval created by 
			 * the instantiation of the class and create a new one, passing the 2 dynamicTexts 
			 * as an array to the params parameter of the timeInterval call.
			 * Doing so, when the callback of the timeInterval is called, that is the this.Update() method,
			 * we will have 2 dynamicTexts to update with 2 different callbacks each,
			 * for the their text manipulation.
			 * 
			 */

			const params = {
				func: [func], // Array in case we expand to have more dynamic texts
				func_params: [func_params],
				meshes: null,
			};

			const meshes = [];
			if (idx === INT_NULL) meshes.push(this.children.buffer[0]); // At first call we deal with the first child mesh at index 0
			else meshes.push(this.children.buffer[idx]);
			params.meshes = meshes;

			const tIdx = TimeIntervalsCreate(msInterval, name, TIME_INTERVAL_REPEAT_ALWAYS, this.Update, params);
			// this.timeIntervalsIdxBuffer.Add(tIdx);
			this.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, tIdx);
		}
		else { // Update multiText via one timeIntrval Update().

			// Params for the new timeInterval.
			const params = {
				func: [], // All timeInterval's callbacks here
				func_params: [], /* These are the parameters NOT for the timeInterval and the 'this.Update()' 
										function callback, rather for the callback that the 'this.Update()' 
										will call, that is the text-creation function for the multiText update. */
				meshes: [], // all the dynamicTexts here. They will be Updated() by one timeInterval.
			};


			// If the user passes an interval idx, use that. // CAUTION: NO CHECK for interval timer validity
			const interval_idx = (custom_interval_idx !== INT_NULL) ? custom_interval_idx : this.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];
			const interval = TimeIntervalsGetByIdx(interval_idx);
			const prevFuncs = interval.clbkParams.params.func;
			const prevFuncsParams = interval.clbkParams.params.func_params;
			const prevMeshBuffer = interval.clbkParams.params.meshes;

			let i = 0;

			for (i = 0; i < prevFuncs.length; i++) {

				// Copy all previous callback functions found in the timeInterval to pass them to the new timeInterval.
				params.func[i] = prevFuncs[i];

				// Copy previous callback's_params.
				if (prevFuncsParams) params.func_params[i] = prevFuncsParams[i];
				else params.func_params[i] = null;

				// Copy previous meshes.
				params.meshes[i] = prevMeshBuffer[i];
			}

			params.func[i] = func;
			params.func_params[i] = func_params;
			params.meshes[i] = this.children.buffer[this.children.boundary];

			/**
			 * Substitute interval_time_value or leave the same??
			 * Use initial interval time if user passes INT_NULL for 'msInterval' param, 
			 * else use the new interval time.
			 */
			if (msInterval === INT_NULL) msInterval = interval.interval;

			/** Destroy old timeInterval and create a new one with all the previous meshes and their callbacks and callback_params */
			TimeIntervalsDestroyByIdx(interval.idx);
			const tIdx = TimeIntervalsCreate(msInterval, name, TIME_INTERVAL_REPEAT_ALWAYS, this.Update, params);
			this.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);
		}
	}


	Update(params) { // TODO!!!: Runs on every timeInterval. Make as efficient as possible

		if (!Array.isArray(params.params.meshes)) alert('Array must be passed as param.meshes to TimeInterval instantiation.')

		const meshes = params.params.meshes;
		const mesheslen = meshes.length


		for (let i = 0; i < mesheslen; i++) {
			let val = 0;
			if (params.params.func[i]) {

				if (params.params.func_params[i])
					val = params.params.func[i](params.params.func_params[i]); // Callback with parameters

				else val = params.params.func[i](); // Callback with no parameters
			}
			else if (params.params.func_params[i]) {
				val = params.params.func_params[i].delta_avg; // No callback, just a value
			}

			const text = `${val}`;
			meshes[i].UpdateText(text);
			// console.log(meshes[i].GetName())
		}

	}


	// SEE ### OnMove Events Implementation Logic
	OnMove(params) {

		// The 'OnMove' function is called by the timeInterval.
		// The timeInterval has been set by an 'OnClick' event.
		const mesh = params.params;
		const mouse_pos = MouseGetPosDif();

		if (mouse_pos.x === 0 && mouse_pos.y === 0) return;

		// Move 'this' text
		mesh.geom.MoveXY(mouse_pos.x, -mouse_pos.y, mesh.gfx);

		// Move children text
		for (let i = 0; i <= mesh.children.boundary; i++) {
			const child = mesh.children.buffer[i];
			if (child) child.MoveXY(mouse_pos.x, -mouse_pos.y, child.gfx);
		}
	}



	/*******************************************************************************************************************************************************/
	// Transformations

	Move(x, y) {

		if (x === 0 && y === 0) return;

		this.geom.pos[0] += x;
		this.geom.pos[1] += y;

		const update_data = {
         sizes: [2],
         data: [x,y],
      }
      Batch_store(this, _, update_data, _);
		
		// Move children text
		for (let i = 0; i <= this.children.boundary; i++) {
			
			const child = this.children.buffer[i];
			if (child) {
				child.geom.pos[0] += x;
				child.geom.pos[1] += y;
				Batch_store(child, _, update_data, _);
			}
		}
	}


	MoveNoGfxUpdate(x, y) {

		this.geom.pos[0] += x;
		this.geom.pos[1] += y;
		for (let i = 0; i <= this.children.boundary; i++) {
			const child = this.children.buffer[i];
			if (child) child.MoveNoGfxUpdate(x, y);
		}

	}


	MoveYNoGfxUpdate(y) {

		this.geom.pos[1] += y;
		for (let i = 0; i <= this.children.boundary; i++) {
			const child = this.children.buffer[i];
			if (child) child.MoveYNoGfxUpdate(y);
		}

	}


	MoveXNoGfxUpdate(x) {

		this.geom.pos[0] += x;
		for (let i = 0; i <= this.children.boundary; i++) {
			const child = this.children.buffer[i];
			if (child) child.MoveXNoGfxUpdate(x);
		}

	}


	Align_pre(target_mesh, flags, pad = [0, 0]) { // Align pre-added to the vertexBuffers

		const pos = [0, 0];
		const dim = this.geom.dim;
		CopyArr2(pos, this.geom.pos);
		let ypos = pos[1] + dim[1] * 2;
		if (flags & ALIGN.VERTICAL) {

			for (let i = 0; i <= this.children.boundary; i++) {

				const child = this.children.buffer[i];
				pos[1] = ypos;

				child.geom.Reposition_pre(pos);
				ypos += child.geom.dim[1] * 2;
			}
		}

		this.alignment = flags;

		// NOTE: The super class is aligning only the top-bot-left-right.
		// TODO: Separate conceptualy the two alignments
		super.Align_pre(target_mesh, flags, pad)

	}


	ClampX(x, margin = 0) {

		const clamp = x - margin * 2;
		// const clamp = x - margin;
		const char_width = Floor(this.fontsize * Font_get_font_advancex(this.mat.texidx));
		let text_width = char_width * 2;

		let k = 0; // Will store the number of characters need to be clamped.
		// Calculate how many characters we must ommit.
		while (text_width < clamp && k < this.geom.num_faces) {
			text_width += char_width * 2;
			k++;
		}
		// this.text_mesh.geom.num_faces -= k;
		this.geom.num_faces = k - 1;

		// Update the gfx buffers, if the mesh is already inserted.
		if (this.is_gfx_inserted) {
			// TODO: Here we decide if we rebuild the vertex buffer or just not draw the ommited text

			const ommited_chars = this.mat.text.length - (k + 1);
			Gl_set_alpha_from_offset(this.gfx, 0, this.geom.num_faces, ommited_chars); // Update alpha in text vertex buffer
		}

		for (let i = 0; i <= this.children.boundary; i++) {

			const child = this.children.buffer[i];
			if (child) {
				k = 0; // Will store the number of characters need to be clamped.
				// Calculate how many characters we must ommit.
				while (text_width < clamp && k < child.geom.num_faces) {
					text_width += char_width;
					k++;
				}
				// this.text_mesh.geom.num_faces -= k;
				child.geom.num_faces = k - 1;

				// Update the gfx buffers, if the mesh is already inserted.
				if (this.is_gfx_inserted) {
					// TODO: Here we decide if we rebuild the vertex buffer or just not draw the ommited text

					const ommited_chars = this.mat.text.length - (k + 1);
					Gl_set_alpha_from_offset(this.gfx, 0, this.geom.num_faces, ommited_chars); // Update alpha in text vertex buffer
				}
			}
		}
	}


	SetGfxProgramGroup(group_mask) {
		this.sid.gfx_group = group_mask;
		for (let i = 0; i <= this.children.boundary; i++) {
			const child = this.children.buffer[i];
			child.sid.gfx_group = group_mask;
		}
	}


	AddToWidgetGroupBuffer(group_bufferidx) {

      if(group_bufferidx === INT_NULL)
         console.error('Catch group_bufferidx === -1. this:', this.GetName(), this)

		if (this.state.mask & MESH_STATE.ACTIVE) {
			this.group_bufferidxs[0] = group_bufferidx;
			this.group_bufferidxs[1] = Widget_group_add(group_bufferidx, this.gfx, this.geom.num_faces);

			for (let i = 0; i <= this.children.boundary; i++) {
				const child = this.children.buffer[i];
				if (child) {
					child.group_bufferidxs[0] = group_bufferidx;
					child.group_bufferidxs[1] = Widget_group_add(group_bufferidx, child.gfx, child.geom.num_faces);
				}
			}
		}
	}


	UpdateWidgetGroupIncrementNumFaces() {

		Widget_group_update_increment(this.group_bufferidxs, this.geom.num_faces);

		for (let i = 0; i <= this.children.boundary; i++) {
			const child = this.children.buffer[i];
			if (child) {
				child.UpdateWidgetGroupIncrementNumFaces();
			}
		}
	}


	UpdateWidgetGroupDecrementNumFaces() {

		Widget_group_update_decrement(this.group_bufferidxs, this.geom.num_faces, this);

		for (let i = 0; i <= this.children.boundary; i++) {
			const child = this.children.buffer[i];
			if (child) {
				child.UpdateWidgetGroupDecrementNumFaces();
			}
		}
	}


}

