"use strict";

import { Widget_gfx_ready_enable } from "./Helpers/WidgetEnableProperties.js";
import { CopyArr2, CopyArr3 } from "../../../Helpers/Math/MathOperations.js";
import { Mouse_get_pos_dif } from "../../Controls/Input/Mouse.js";
import { Create_widget_text } from "./Helpers/CreateWidgetInterface.js";
import { Mesh_unif_is_vb_root_wpos, Mesh_unif_set_vb_root_wpos, Mesh_unif_set_vb_root_wposx, Mesh_unif_set_vb_root_wposy } from "../../Core/MeshUniformsBuffer.js";
import { Root_group_view_buffer_add_mesh, Root_group_view_buffer_create_root } from "../../Core/Views/RootView.js";
import { Time_intervals_create, Time_intervals_destroy_byidx, Time_intervals_get_byidx } from "../../Timers/TimeIntervals.js";
import { Text_Mesh } from "../Meshes/Text_Mesh.js";
import { Mesh_add_wpos_xy, Set_color_a } from "../Operations/MeshAttributesFunctions.js";
import { View_add_mesh, View_create_new_group } from "../../Core/Views/MeshBufferViews.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";



/**
 * 
 * // TODO: When we have to implement that the user decides for the font type (sdf...etc)
 * then the CalculateSdfOuterFromDim must:
 * 1. live in an if statement (if(fontType is sdf))
 * 2. move the function to the parent class instead of call it from all the children classes of Text_Mesh
 */
export class Widget_Text extends Text_Mesh {

	constructor(mesh_bufferidx, properties) {

		super(mesh_bufferidx, properties)
		this.type |= MESH_TYPE.WIDGET_TEXT;

		this.StylesSetPad(properties.pad);

		// New align fix
		this.align.flags = properties.layout;

		if (properties.is_root & ROOT_WIDGETS.CREATE_ROOT) {

			this.root_bufferidx = Root_group_view_buffer_create_root(this.mesh_bufferidx);
			// Create view group
			this.group_bufferidxs[0] = View_create_new_group(this);
		}
	}



	GfxUniformsEnable(flags, name, type, shader_flags) {

		super.EnableGfxUniforms(flags, name, type, shader_flags);

	}



	GfxUniformsSetClbk(unif_name, Clbk, clbk_params) {

		// NOTE: The call must happen once per vb, so it is sufficient to make the call for every mesh of the widget that belongs to a different vb group
		this.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);

	}


	Activate() {

		this.state.mask |= MESH_STATE_FLAGS.ACTIVE;
	}


	Deactivate() {

		this.state.mask &= ~MESH_STATE_FLAGS.ACTIVE;
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
		Root_group_view_buffer_add_mesh(this.root_bufferidx, this.mesh_bufferidx);
	}
    /** */
    SetViewGroupIndex(view_groupidx) {

        this.group_bufferidxs[0] = view_groupidx;
    }

	GfxCtxAddFlag(FLAGS, gfx_ctx_parent = INT_NULL, recurse = false) {

		if (this.gfx_ctx_parent === INT_NULL) {

			this.gfx_ctx_flags |= FLAGS;
			this.gfx_ctx_parent = gfx_ctx_parent;

		}
	}


	GfxCtxSetFlag(FLAGS, gfx_ctx_parent = INT_NULL, recurse = false) {

		if (this.gfx_ctx_parent === INT_NULL) {

			this.gfx_ctx_flags = FLAGS;
			this.gfx_ctx_parent = gfx_ctx_parent;

		}
	}


	/*******************************************************************************************************************************************************/
	// Alignment

	Align_pre(target_mesh, flags, pad = [0, 0]) { // Align pre-added to the vertexBuffers

		const pos = [0, 0];
		CopyArr2(pos, this.geom.pos);

		if (flags & TEXT_ALIGN.LEFT) {

			const pos = [0, 0];
			CopyArr2(pos, this.geom.pos);

			// Vertical allignment
			pos[1] = target_mesh.geom.pos[1];

			// Horizontal allignment
			pos[0] = (target_mesh.geom.pos[0] - target_mesh.geom.dim[0]) + (this.geom.dim[0]) + pad[0];

			CopyArr2(this.geom.pos, pos);

		}
		else if (flags & TEXT_ALIGN.RIGHT) {

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

	AlignNEW(pos_x, pos_y) {

		const pad_x = this.StylesGetPad(STYLES.AXIS.X);
		const pad_y = this.StylesGetPad(STYLES.AXIS.Y);
		this.geom.pos[0] = pos_x + pad_x;
		this.geom.pos[1] = pos_y + pad_y;

		// const text_pad_x = this.text_mesh.StylesGetPad(STYLES.AXIS.X);
		// const text_pad_y = this.text_mesh.StylesGetPad(STYLES.AXIS.Y);
		// this.text_mesh.geom.pos[0] = pos_x + pad_x + text_pad_x;
		// this.text_mesh.geom.pos[1] = pos_y + pad_y + text_pad_y;

		return {
			dim_x: this.text_width + pad_x / 2,
			dim_y: this.text_height + pad_y / 1,
			pad_x: pad_x / 2,
			pad_y: pad_y / 2,
		};
	}


	/*******************************************************************************************************************************************************/
	// Getters-Setters



	/*******************************************************************************************************************************************************/
	// Transformations


	ClampX(x, margin = 0) {
		alert('00998877655')
		// const clamp = x - margin;
		// // const clamp = x - margin*2;

		// const char_width = Floor(this.fontsize * Font_get_font_advancex(this.mat.uvidx)) * 2;
		// let text_width = char_width;
		// let k = 0; // Will store the number of characters need to be clamped.
		// // Calculate how many characters we must ommit.
		// while (text_width + char_width < clamp && k < this.geom.num_faces) {
		// 	text_width += char_width;
		// 	k++;
		// }
		// this.geom.num_faces = k;

		// // Update the gfx buffers, if the mesh is already inserted.
		// if (this.is_gfx_inserted) {
		// 	// TODO: Here we decide if we rebuild the vertex buffer or just not draw the ommited text

		// 	const ommited_chars = this.mat.char_buffer.boundary - this.geom.num_faces - 1;
		// 	Gl_set_alpha_from_offset(this.gfx, 0, this.geom.num_faces - 1, ommited_chars); // Update alpha in text vertex buffer
		// 	// Gl_set_alpha_from_offset(this.gfx, 0, this.geom.num_faces, this.geom.num_faces); // Update alpha in text vertex buffer
		// }
	}


	SetPosZNoGfxUpdate(val) {
		this.geom.pos[2] = val;
	}


	SetIsGfxInserted(flag) {
		if (this.is_gfx_inserted !== flag) this.is_gfx_inserted = flag; // If true then set false
	}


	// Move(x, y) {

	// 	if (x === 0 && y === 0) return;

	// 	this.geom.pos[0] += x;
	// 	this.geom.pos[1] += y;
	// 	this.geom.AddWposXY(this.gfx, x, y);

	// 	// console.log(this.GetName(), this.geom.pos)

	// }


	ListenEventConstruct() { return false; }

}

































































export class Widget_Multi_Text extends Widget_Text {

	alignment = 0x0;

	/** Set the max number of characters for the dynamic text, by passing any text as 'dynamic_text' of length= dynamic text number of characters*/
	constructor(mesh_bufferidx, properties) {

		super(mesh_bufferidx, properties);
		this.type |= MESH_TYPE.WIDGET_TEXT_DYNAMIC;

		this.alignment = properties.align;
		this.TEMPORARY_variant_idx = properties.variant_idx;

		Widget_gfx_ready_enable({mesh:this, enable_attr_dim:false,});

	}


	Destroy() {

		for (let i = 0; i <= this.children.boundary; i++) {

			if (this.children.buffer[i]) {

				// this.children.buffer[i].Destroy();
				const shift_children = this.children.buffer[i].Destroy();
				if (shift_children) i--;
				// console.log(i)
			}
		}

		return super.Destroy();
	}


	AddChild(text_mesh) {

		text_mesh.idx = this.children.Add(text_mesh);
		text_mesh.parent = this;

		if (this.root_bufferidx !== INT_NULL && text_mesh.root_bufferidx === INT_NULL) {
			text_mesh.root_bufferidx = this.root_bufferidx;
			Root_group_view_buffer_add_mesh(text_mesh.root_bufferidx, text_mesh.mesh_bufferidx);
		}

		// this.children_all.Add(text_mesh.mesh_bufferidx);

		// this.Align_pre(text_mesh, this.alignment)
		this.Align_pre(this, this.alignment)
		return text_mesh.idx;
	}


	AddToWidgetRootBuffer(root_bufferidx) {

		this.root_bufferidx = root_bufferidx;
		Root_group_view_buffer_add_mesh(this.root_bufferidx, this.mesh_bufferidx);

		for (let i = 0; i <= this.children.boundary; i++) {
			const child = this.children.buffer[i];
			if (child) {

				child.root_bufferidx = root_bufferidx;
				Root_group_view_buffer_add_mesh(child.root_bufferidx, child.mesh_bufferidx);
			}
		}
	}
    /** */
    SetViewGroupIndex(view_groupidx) {

        this.group_bufferidxs[0] = view_groupidx;
		for (let i = 0; i <= this.children.boundary; i++) {
			const child = this.children.buffer[i];
			if (child) {
				child.group_bufferidxs[0] = view_groupidx;
			}
		}
    }

	Activate() {

		this.state.mask |= MESH_STATE_FLAGS.ACTIVE;
		for (let i = 0; i <= this.children.boundary; i++) {
			if (this.children.buffer[i]) this.children.buffer[i].state.mask |= MESH_STATE_FLAGS.ACTIVE;
		}
	}


	Deactivate() {

		this.state.mask &= ~MESH_STATE_FLAGS.ACTIVE;
		for (let i = 0; i <= this.children.boundary; i++) {
			if (this.children.buffer[i]) this.children.buffer[i].state.mask &= ~MESH_STATE_FLAGS.ACTIVE;
		}
	}


	StateEnable(MASK = 0x0) {

		this.state.mask |= MASK;
		for (let i = 0; i <= this.children.boundary; i++) {
			if (this.children.buffer[i]) this.children.buffer[i].state.mask |= MASK;
		}
	}


	StateDisable(MASK = 0x0) {

		this.state.mask &= ~MASK;
		for (let i = 0; i <= this.children.boundary; i++) {
			if (this.children.buffer[i]) this.children.buffer[i].state.mask &= ~MASK;
		}
	}


	GfxCtxSetFlag(FLAGS, gfx_ctx_parent = INT_NULL, recurse = false) {

		if (this.gfx_ctx_parent === INT_NULL) {

			this.gfx_ctx_flags = FLAGS;
			this.gfx_ctx_parent = gfx_ctx_parent;

			if (recurse) {
				for (let i = 0; i <= this.children.boundary; i++) {
					if (this.children.buffer[i]) {
						this.children.buffer[i].gfx_ctx_flags = FLAGS;
						this.children.buffer[i].gfx_ctx_parent = gfx_ctx_parent;
					}
				}
			}
		}
	}


	GfxCtxAddFlag(FLAGS, gfx_ctx_parent = INT_NULL, recurse = false) {

		if (this.gfx_ctx_parent === INT_NULL) {

			this.gfx_ctx_flags |= FLAGS;
			this.gfx_ctx_parent = gfx_ctx_parent;

			if (recurse) {
				for (let i = 0; i <= this.children.boundary; i++) {
					if (this.children.buffer[i]) {
						this.children.buffer[i].gfx_ctx_flags |= FLAGS;
						this.children.buffer[i].gfx_ctx_parent = gfx_ctx_parent;
					}
				}
			}
		}
	}


	GfxUniformsEnable(flags, name, type, shader_flags) {

		super.EnableGfxUniforms(flags, name, type, shader_flags);
		for (let i = 0; i <= this.children.boundary; i++) {
			const child = this.children.buffer[i];
			if (child) child.EnableGfxUniforms(flags, name, type, shader_flags);
		}

	}


	GfxUniformsSetClbk(unif_name, Clbk, clbk_params) {

		// NOTE: The call must happen once per vb, so it is sufficient to make the call for every mesh of the widget that belongs to a different vb group
		this.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);
		for (let i = 0; i <= this.children.boundary; i++) {
			const child = this.children.buffer[i];
			// if (child) child.GfxUniformsSetClbk(unif_name, Clbk, clbk_params);
		}
	}


	/*******************************************************************************************************************************************************/
	// GFX

	GenGfxCtx(FLAGS, specific_vb_groupidx = INT_NULL) {

		this.gfx = Gfx_generate_context(FLAGS, this, specific_vb_groupidx);
		
		// Add to view group
		View_add_mesh(this.group_bufferidxs[0], this);
		
		// super.GenGfxCtx(FLAGS, specific_vb_groupidx);
		// We know that the 'this' is of type text, so we use the same gfx buffer index for all children texts
		FLAGS |= GFX_CTX_FLAGS.SPECIFIC;
		const vb_groupidx = this.gfx.vb.groupidx;

		for (let i = 0; i <= this.children.boundary; i++) {

			const child = this.children.buffer[i];
			// console.log('',vb_groupidx, child.GetName())
			// if (child) child.gfx = child.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, igfx); // Pass the already exixting gfx buffers for use
			if (child) {
				child.gfx = child.GenGfxCtx(FLAGS, vb_groupidx); // Pass the already exixting gfx buffers for use

				// NOTE: The batch_buffer_vbidx for the parent text is created from the super.GenGfxCtx(). So we have to set it for all children from here.
				child.batch_buffer_vbidx = this.batch_buffer_vbidx;
			}
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


	// GetMaxWidth() {

	// 	let max_width = super.GetMaxWidth();

	// 	if (this.alignment & TEXT_ALIGN.HORIZONTAL) { // If the children text meshes are aligned horizontaly, acumulate all text meshes widths
	// 		for (let i = 0; i <= this.children.boundary; i++) {
	// 			// if (this.children.buffer[i]) max_width += this.children.buffer[i].CalculateTextWidth().w + this.children.buffer[i].StylesGetPad(STYLES.AXIS.X);
	// 			if (this.children.buffer[i]) max_width += this.children.buffer[i].CalculateTextWidth().w + this.children.buffer[i].StylesGetPad(STYLES.AXIS.X);
	// 		}
	// 		return max_width;
	// 	}
	// 	else {
	// 		for (let i = 0; i <= this.children.boundary; i++) {
	// 			if (this.children.buffer[i]) {

	// 				const w = this.children.buffer[i].CalculateTextWidth().w + this.children.buffer[i].StylesGetPad(STYLES.AXIS.X);
	// 				if (max_width < w)
	// 					max_width = w;
	// 			}
	// 		}
	// 		return max_width;
	// 	}

	// }
	GetMaxWidth() {

		let max_width = super.GetMaxWidth();

		if (this.alignment & TEXT_ALIGN.HORIZONTAL) { // If the children text meshes are aligned horizontaly, acumulate all text meshes widths
			for (let i = 0; i <= this.children.boundary; i++) {
				if (this.children.buffer[i]) max_width += this.children.buffer[i].text_width + this.children.buffer[i].StylesGetPad(STYLES.AXIS.X);
			}
			return max_width;
		}
		else {
			for (let i = 0; i <= this.children.boundary; i++) {
				if (this.children.buffer[i]) {

					const w = this.children.buffer[i].text_width + this.children.buffer[i].StylesGetPad(STYLES.AXIS.X);
					if (max_width < w)
						max_width = w;
				}
			}
			return max_width;
		}

	}


	// GetMaxHeight() {

	// 	let max_height = this.geom.dim[1] + this.StylesGetPad(STYLES.AXIS.Y);

	// 	// HACK: TODO: Set only one of both(SECTION or TEXT_ALIGN) as global align bit field
	// 	if (this.alignment & TEXT_ALIGN.HORIZONTAL) { // If the children text meshes are aligned horizontaly, return the height of the 'this' text mesh height
	// 		return max_height;
	// 	}
	// 	else { // Else calculate all the lines of the text meshes
	// 		for (let i = 0; i <= this.children.boundary; i++) {
	// 			if (this.children.buffer[i]) max_height += this.children.buffer[i].geom.dim[1] + this.children.buffer[i].StylesGetPad(STYLES.AXIS.Y);
	// 		}
	// 		return max_height;
	// 	}

	// }
	GetMaxHeight() {

		let max_height = this.geom.dim[1] + this.StylesGetPad(STYLES.AXIS.Y);

		// HACK: TODO: Set only one of both(SECTION or TEXT_ALIGN) as global align bit field
		if (this.alignment & TEXT_ALIGN.HORIZONTAL) { // If the children text meshes are aligned horizontaly, return the height of the 'this' text mesh height
			return max_height;
		}
		else { // Else calculate all the lines of the text meshes
			for (let i = 0; i <= this.children.boundary; i++) {
				if (this.children.buffer[i]) max_height += this.children.buffer[i].text_height + this.children.buffer[i].StylesGetPad(STYLES.AXIS.Y);
			}
			return max_height;
		}

	}


	SetColorAlpha(alpha) {

		// super.SetColorAlpha(alpha);
		Set_color_a(this, alpha);
		for (let i = 0; i <= this.children.boundary; i++) {
			// this.children.buffer[i].SetColorAlpha(alpha);
			if (this.children.buffer[i]) Set_color_a(this.children.buffer[i], alpha);
		}
	}


	SetIsGfxInserted(flag) {
		if (this.is_gfx_inserted !== flag) this.is_gfx_inserted = flag; // If true then set false

		for (let i = 0; i <= this.children.boundary; i++) {
			if (this.children.buffer[i] && this.children.buffer[i].is_gfx_inserted !== flag) this.children.buffer[i].is_gfx_inserted = flag;
		}
	}







	/*******************************************************************************************************************************************************/
	// 

	// TODO: Implement align self correctly
	// TODO: Is there a way to align differently for each text mesh????

	CreateNewText(dynamic_text, font_size, text_col2, pad = [0, 0], bold = .5, align = TEXT_ALIGN.HORIZONTAL, align_NEW=LAYOUT.HORIZONTAL) {

		/** DEBUG ERROR*/ if (!Array.isArray(pad)) console.error('Pad is not of type array');

		let pos = [0, 0, 0];
		CopyArr3(pos, this.geom.pos)
		pos[2] += 1;

		// Find the last text mesh.
		let prev_text_mesh = null;
		if (this.children.active_count) {

			prev_text_mesh = this.children.buffer[this.children.boundary];
			ERROR_NULL(prev_text_mesh, ' @ Widget_Dynamic_Text_Mesh.CreateNewText(). WidgetText.js');
		}
		else prev_text_mesh = this;

		// const new_text = Create_widget_text(_, dynamic_text, pos, font_size, text_col2, bold, this.mat.texture_file_id, _, this.TEMPORARY_variant_idx, _, pad);
		const new_text = Create_widget_text({
			is_root:0x0,
			text:dynamic_text, 
			pos:pos, 
			font_size:font_size, 
			col:text_col2, 
			bold:bold, 
			texture_id:this.mat.texture_file_id, 
			variant_idx:this.TEMPORARY_variant_idx,
			pad:pad,
			is_debug_mesh:false,
		});

		Widget_gfx_ready_enable({mesh:new_text, enable_attr_dim:false,});

		new_text.SetViewGroupIndex(this.group_bufferidxs[0]);
		new_text.type = MESH_TYPE.WIDGET_TEXT_DYNAMIC;
		new_text.align.flags = align_NEW;
		// new_text.StylesSetPad(pad);

		// Add the new new_text as a child of 'this'.
		const idx = this.AddChild(new_text);
		this.type |= MESH_TYPE.WIDGET_TEXT_DYNAMIC | new_text.geom.type | new_text.mat.type;

		// this.CalculateTextWidth();


		// Align text properly
		// if (prev_text_mesh.text_width === 0) {
		// 	prev_text_mesh.CalculateTextWidth().w;
		// }

		// Position horizontaly
		// Align_between(this.alignment, prev_text_mesh.geom, new_text.geom, pad, new_text.StylesGetPad(), prev_text_mesh.advancex)

		// TODO: the alignment is no longer needed, use the new align system to align every multi_text

		// const first_pad = prev_text_mesh.StylesGetPad();
		// const second_pad = new_text.StylesGetPad();


		if (this.alignment & TEXT_ALIGN.VERTICAL) {
			// new_text.geom.pos[0] = prev_text_mesh.geom.dim[0];
			// new_text.geom.pos[1] = prev_text_mesh.geom.pos[1];
			// new_text.geom.pos[1] += (prev_text_mesh.geom.dim[1] + first_pad[1]) + new_text.geom.dim[1];
			
			// New align fix
			new_text.align.flags = LAYOUT.VERTICAL;
		}
		else if (this.alignment & TEXT_ALIGN.HORIZONTAL) {
			// new_text.geom.pos[0] = prev_text_mesh.geom.pos[0] + first_pad[0];
			// new_text.geom.pos[0] += prev_text_mesh.text_width * 2 + second_pad[0];
			// new_text.geom.pos[1] = prev_text_mesh.geom.pos[1];

			// New align fix
			new_text.align.flags = LAYOUT.HORIZONTAL;
		}

		// const pos_dif = Align_self_get_dif(this.alignment, this.geom, new_text.geom, pad, prev_text_mesh.advancex);
		// AddArr2(new_text.geom.pos, pos_dif);

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

			const tIdx = Time_intervals_create(msInterval, name, TIME_INTERVAL_REPEAT_ALWAYS, this.Update, params);
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
			const interval = Time_intervals_get_byidx(interval_idx);
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
			Time_intervals_destroy_byidx(interval.idx);
			const tIdx = Time_intervals_create(msInterval, name, TIME_INTERVAL_REPEAT_ALWAYS, this.Update, params);
			this.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, tIdx);
			// this.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);
		}
	}


	Update(params) { // TODO!!!: Runs on every timeInterval. Make as efficient as possible

		if (!Array.isArray(params.params.meshes)) alert('Array must be passed as param.meshes to TimeInterval instantiation.')

		const meshes = params.params.meshes;
		const mesheslen = meshes.length


		for (let i = 0; i < mesheslen; i++) {
			const val = params.params.func[i](params.params.func_params[i]); // Callback with parameters
			meshes[i].RenderTextFromNumber(val);
		}

	}


	// SEE ### OnMove Events Implementation Logic
	OnMove(params) {

		// The 'OnMove' function is called by the timeInterval.
		// The timeInterval has been set by an 'OnClick' event.
		const mesh = params.params;
		const mouse_pos = Mouse_get_pos_dif();

		if (mouse_pos.x === 0 && mouse_pos.y === 0) return;

		// Move 'this' text
		Mesh_add_wpos_xy(mesh, mouse_pos.x, -mouse_pos.y,);

		// Move children text
		for (let i = 0; i <= mesh.children.boundary; i++) {
			const child = mesh.children.buffer[i];
			if (child) child.AddWposXY(child.gfx, mouse_pos.x, -mouse_pos.y,);
		}
	}



	/*******************************************************************************************************************************************************/
	// Transformations

	// Move(x, y) {

	// 	if (x === 0 && y === 0) return;

	// 	this.geom.pos[0] += x;
	// 	this.geom.pos[1] += y;
	// }


	MoveNoGfxUpdate(x, y) {

		this.geom.pos[0] += x;
		this.geom.pos[1] += y;
		for (let i = 0; i <= this.children.boundary; i++) {

			const child = this.children.buffer[i];
			if (child) {

				child.geom.pos[0] += x;
				child.geom.pos[1] += y;
				// if (child) child.MoveNoGfxUpdate(x, y);
			}
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


	SetPosXYNoGfxUpdate(x, y) {

		if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
			Mesh_unif_set_vb_root_wpos(this.root_posidx, x, y);
		}
		else { // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update all offsets 
			this.geom.pos[0] = x;
			this.geom.pos[1] = y;
			for (let i = 0; i <= this.children.boundary; i++) {
				if (this.children.buffer[i]) {

					this.children.buffer[i].geom.pos[0] = x;
					this.children.buffer[i].geom.pos[1] = y;
				}
			}
		}
	}


	SetPosXNoGfxUpdate(x) {
		if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
			Mesh_unif_set_vb_root_wposx(this.root_posidx, x);
		}
		else { // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update all offsets 
			for (let i = 0; i <= this.children.boundary; i++) {
				if (this.children.buffer[i]) this.children.buffer[i].geom.pos[0] = x;
			}
		}
	}


	SetPosYNoGfxUpdate(y) {
		this.geom.pos[1] = y;
		if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
			Mesh_unif_set_vb_root_wposy(this.root_posidx, y);
		}
		else { // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update all offsets 
			for (let i = 0; i <= this.children.boundary; i++) {
				if (this.children.buffer[i]) this.children.buffer[i].geom.pos[1] = y;
			}
		}
	}


	// SetWposXFromAddWPos(x) {
	// 	this.geom.SetWposXFromAddWPos(x);
	// }


	// SetWposYFromAddWPos(y) {
	// 	this.geom.SetWposYFromAddWPos(y);
	// }


	// TEMP_recalc(x, y) {
	// 	alert('IMPLEMENT ME\nTEMP_recalc\nWidget_Multi_Text')
	// 	// this.geom.pos[0] = x;
	// 	// this.geom.pos[1] = y;
	// 	// for (let i = 0; i <= this.children.boundary; i++) {
	// 	//    const child = this.children.buffer[i];
	// 	//    if (child) child.TEMP_recalc(x, y);
	// 	// }
	// }


	SetPosZNoGfxUpdate(z) {
		this.geom.pos[2] = z;
		for (let i = 0; i <= this.children.boundary; i++) {
			if (this.children.buffer[i]) this.children.buffer[i].geom.pos[2] = z;
		}
	}



	Align_pre(target_mesh, flags, pad = [0, 0]) { // Align pre-added to the vertexBuffers

		const pos = [0, 0];
		const dim = this.geom.dim;
		CopyArr2(pos, this.geom.pos);
		let ypos = pos[1] + dim[1] * 2;
		if (flags & TEXT_ALIGN.VERTICAL) {

			for (let i = 0; i <= this.children.boundary; i++) {

				const child = this.children.buffer[i];

				if (child) {

					pos[1] = ypos;

					// child.geom.Reposition_pre(pos);
					ypos += child.geom.dim[1] * 2;
				}
			}
		}

		this.alignment = flags;

		// NOTE: The super class is aligning only the top-bot-left-right.
		// TODO: Separate conceptualy the two alignments
		super.Align_pre(target_mesh, flags, pad)

	}

	AlignNEW(pos_x, pos_y) {

		const pad_x = this.StylesGetPad(STYLES.AXIS.X);
		const pad_y = this.StylesGetPad(STYLES.AXIS.Y);
		this.geom.pos[0] = pos_x + pad_x;
		this.geom.pos[1] = pos_y + pad_y;

		let max_width = this.text_width+pad_x;
		let max_height = this.text_height;
		let posx = this.geom.pos[0] + this.text_width * 2;
		let posy = this.geom.pos[1];
		// let accum_row_width = this.text_width+pad_x;
		let accum_row_width = this.geom.pos[0] + this.text_width;

		for( let i=0; i<=this.children.boundary; i++) {
			
			const child = this.children.buffer[i];
			const child_pad_x = child.StylesGetPad(STYLES.AXIS.X);
			const child_pad_y = child.StylesGetPad(STYLES.AXIS.Y);

			// Set max width before current child calculation
			if(max_width < accum_row_width) max_width = accum_row_width;

			if(child.align.flags & LAYOUT.HORIZONTAL){
				
				// posx += child_pad_x; // Add the padding of the current child
				// posx = accum_row_width*2 + child_pad_x; // Add the padding of the current child
				posx = accum_row_width*2 + child_pad_x; // Add the padding of the current child
				child.geom.pos[0] = posx;
				child.geom.pos[1] = posy;
				accum_row_width += child.text_width+child_pad_x/2;
			}
			else if(child.align.flags & LAYOUT.VERTICAL){
				
				posx = pos_x+pad_x+child_pad_x;
				posy = max_height*2 + child_pad_y
				
				child.geom.pos[0] = posx;
				child.geom.pos[1] = posy;
				
				max_height += child.text_height + child_pad_y;
				accum_row_width = child.text_width + child_pad_x/2;
			}
			
			posx += child.text_width * 2; // advance posx for the next child
			
		}
		
		if(max_width < accum_row_width) max_width = accum_row_width;
		return {
			dim_x: max_width + pad_x,
			dim_y: max_height + pad_y,
			pad_x: pad_x / 2,
			pad_y: pad_y / 2,
		};
	}


	ListenEventConstruct() {
		return false;
	}


}

