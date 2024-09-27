"use strict";

import { Abs, AddArr3, Clamp, CopyArr4, Lerp, Mix_vec3_float32Array, Mix_vec4_float32Array, Mult_arr3_scalar, Mult_arr4_scalar2 } from "../../../../Helpers/Math/MathOperations.js";



export const TRANSPARENT = new Float32Array([0.0, 0.0, 0.0, 0.0]);
export const WHITE = new Float32Array([1.0, 1.0, 1.0, 1.0]);
export const BLACK = new Float32Array([0.04, 0.04, 0.04, 1.0]);

// export function CHECK_WHITE(){
// 	if(WHITE[3] < 1)
// 		console.log()
// }


const ORANGE0 = new Float32Array([0.1, 0.050, 0.0, 1.0]);
const ORANGE1 = new Float32Array([0.2, 0.100, 0.0, 1.0]);
const ORANGE2 = new Float32Array([0.3, 0.150, 0.0, 1.0]);
const ORANGE3 = new Float32Array([0.4, 0.200, 0.0, 1.0]);
const ORANGE4 = new Float32Array([0.5, 0.250, 0.0, 1.0]);
const ORANGE5 = new Float32Array([0.6, 0.300, 0.0, 1.0]);
const ORANGE6 = new Float32Array([0.7, 0.350, 0.0, 1.0]);
const ORANGE7 = new Float32Array([0.8, 0.400, 0.0, 1.0]);
const ORANGE8 = new Float32Array([0.9, 0.450, 0.0, 1.0]);
const ORANGE9 = new Float32Array([1.0, 0.500, 0.0, 1.0]);
export const ORANGE = [ORANGE0, ORANGE1, ORANGE2, ORANGE3, ORANGE4, ORANGE5, ORANGE6, ORANGE7, ORANGE8, ORANGE9,];

const ORANGEL0 = new Float32Array([0.1, 0.025, 0.0, 1.0]);
const ORANGEL1 = new Float32Array([0.2, 0.050, 0.0, 1.0]);
const ORANGEL2 = new Float32Array([0.3, 0.075, 0.0, 1.0]);
const ORANGEL3 = new Float32Array([0.4, 0.100, 0.0, 1.0]);
const ORANGEL4 = new Float32Array([0.5, 0.125, 0.0, 1.0]);
const ORANGEL5 = new Float32Array([0.6, 0.150, 0.0, 1.0]);
const ORANGEL6 = new Float32Array([0.7, 0.175, 0.0, 1.0]);
const ORANGEL7 = new Float32Array([0.8, 0.200, 0.0, 1.0]);
const ORANGEL8 = new Float32Array([0.9, 0.225, 0.0, 1.0]);
const ORANGEL9 = new Float32Array([1.0, 0.250, 0.0, 1.0]);
export const ORANGEL = [ORANGEL0, ORANGEL1, ORANGEL2, ORANGEL3, ORANGEL4, ORANGEL5, ORANGEL6, ORANGEL7, ORANGEL8, ORANGEL9,];



const ORANGER0 = new Float32Array([0.1, 0.075, 0.0, 1.0]);
const ORANGER1 = new Float32Array([0.2, 0.150, 0.0, 1.0]);
const ORANGER2 = new Float32Array([0.3, 0.225, 0.0, 1.0]);
const ORANGER3 = new Float32Array([0.4, 0.300, 0.0, 1.0]);
const ORANGER4 = new Float32Array([0.5, 0.375, 0.0, 1.0]);
const ORANGER5 = new Float32Array([0.6, 0.450, 0.0, 1.0]);
const ORANGER6 = new Float32Array([0.7, 0.525, 0.0, 1.0]);
const ORANGER7 = new Float32Array([0.8, 0.600, 0.0, 1.0]);
const ORANGER8 = new Float32Array([0.9, 0.675, 0.0, 1.0]);
const ORANGER9 = new Float32Array([1.0, 0.750, 0.0, 1.0]);
export const ORANGER = [ORANGER0, ORANGER1, ORANGER2, ORANGER3, ORANGER4, ORANGER5, ORANGER6, ORANGER7, ORANGER8, ORANGER9,];


const RED0 = new Float32Array([0.1, 0.0, 0.0, 1.0]);
const RED1 = new Float32Array([0.2, 0.0, 0.0, 1.0]);
const RED2 = new Float32Array([0.3, 0.0, 0.0, 1.0]);
const RED3 = new Float32Array([0.4, 0.0, 0.0, 1.0]);
const RED4 = new Float32Array([0.5, 0.0, 0.0, 1.0]);
const RED5 = new Float32Array([0.6, 0.0, 0.0, 1.0]);
const RED6 = new Float32Array([0.7, 0.0, 0.0, 1.0]);
const RED7 = new Float32Array([0.8, 0.0, 0.0, 1.0]);
const RED8 = new Float32Array([0.9, 0.0, 0.0, 1.0]);
const RED9 = new Float32Array([1.0, 0.0, 0.0, 1.0]);
export const RED = [RED0, RED1, RED2, RED3, RED4, RED5, RED6, RED7, RED8, RED9,];

const REDL0 = new Float32Array([0.1, 0.01, 0.0, 1.0]);
const REDL1 = new Float32Array([0.2, 0.02, 0.0, 1.0]);
const REDL2 = new Float32Array([0.3, 0.03, 0.0, 1.0]);
const REDL3 = new Float32Array([0.4, 0.04, 0.0, 1.0]);
const REDL4 = new Float32Array([0.5, 0.05, 0.0, 1.0]);
const REDL5 = new Float32Array([0.6, 0.06, 0.0, 1.0]);
const REDL6 = new Float32Array([0.7, 0.07, 0.0, 1.0]);
const REDL7 = new Float32Array([0.8, 0.08, 0.0, 1.0]);
const REDL8 = new Float32Array([0.9, 0.09, 0.0, 1.0]);
const REDL9 = new Float32Array([1.0, 0.10, 0.0, 1.0]);
export const REDL = [REDL0, REDL1, REDL2, REDL3, REDL4, REDL5, REDL6, REDL7, REDL8, REDL9,];

const BLUE0 = new Float32Array([0.0, 0.0, 0.1, 1.0]);
const BLUE1 = new Float32Array([0.0, 0.0, 0.2, 1.0]);
const BLUE2 = new Float32Array([0.0, 0.0, 0.3, 1.0]);
const BLUE3 = new Float32Array([0.0, 0.0, 0.4, 1.0]);
const BLUE4 = new Float32Array([0.0, 0.0, 0.5, 1.0]);
const BLUE5 = new Float32Array([0.0, 0.0, 0.6, 1.0]);
const BLUE6 = new Float32Array([0.0, 0.0, 0.7, 1.0]);
const BLUE7 = new Float32Array([0.0, 0.0, 0.8, 1.0]);
const BLUE8 = new Float32Array([0.0, 0.0, 0.9, 1.0]);
const BLUE9 = new Float32Array([0.0, 0.0, 1.0, 1.0]);
export const BLUE = [BLUE0, BLUE1, BLUE2, BLUE3, BLUE4, BLUE5, BLUE6, BLUE7, BLUE8, BLUE9,];

const BLUEL0 = new Float32Array([0.0, 0.05, 0.1, 1.0]);
const BLUEL1 = new Float32Array([0.0, 0.10, 0.2, 1.0]);
const BLUEL2 = new Float32Array([0.0, 0.15, 0.3, 1.0]);
const BLUEL3 = new Float32Array([0.0, 0.20, 0.4, 1.0]);
const BLUEL4 = new Float32Array([0.0, 0.25, 0.5, 1.0]);
const BLUEL5 = new Float32Array([0.0, 0.30, 0.6, 1.0]);
const BLUEL6 = new Float32Array([0.0, 0.35, 0.7, 1.0]);
const BLUEL7 = new Float32Array([0.0, 0.40, 0.8, 1.0]);
const BLUEL8 = new Float32Array([0.0, 0.45, 0.9, 1.0]);
const BLUEL9 = new Float32Array([0.0, 0.50, 1.0, 1.0]);
export const BLUEL = [BLUEL0, BLUEL1, BLUEL2, BLUEL3, BLUEL4, BLUEL5, BLUEL6, BLUEL7, BLUEL8, BLUEL9,];

const BLUER0 = new Float32Array([0.015, 0.000, 0.1, 1.0]);
const BLUER1 = new Float32Array([0.030, 0.025, 0.2, 1.0]);
const BLUER2 = new Float32Array([0.045, 0.050, 0.3, 1.0]);
const BLUER3 = new Float32Array([0.060, 0.075, 0.4, 1.0]);
const BLUER4 = new Float32Array([0.075, 0.000, 0.5, 1.0]);
const BLUER5 = new Float32Array([0.090, 0.100, 0.6, 1.0]);
const BLUER6 = new Float32Array([0.105, 0.125, 0.7, 1.0]);
const BLUER7 = new Float32Array([0.120, 0.150, 0.8, 1.0]);
const BLUER8 = new Float32Array([0.135, 0.175, 0.9, 1.0]);
const BLUER9 = new Float32Array([0.150, 0.200, 1.0, 1.0]);
export const BLUER = [BLUER0, BLUER1, BLUER2, BLUER3, BLUER4, BLUER5, BLUER6, BLUER7, BLUER8, BLUER9,];


const GREENL0 = new Float32Array([0.05, 0.1, 0.0, 1.0]);
const GREENL1 = new Float32Array([0.10, 0.2, 0.0, 1.0]);
const GREENL2 = new Float32Array([0.15, 0.3, 0.0, 1.0]);
const GREENL3 = new Float32Array([0.20, 0.4, 0.0, 1.0]);
const GREENL4 = new Float32Array([0.25, 0.5, 0.0, 1.0]);
const GREENL5 = new Float32Array([0.30, 0.6, 0.0, 1.0]);
const GREENL6 = new Float32Array([0.35, 0.7, 0.0, 1.0]);
const GREENL7 = new Float32Array([0.40, 0.8, 0.0, 1.0]);
const GREENL8 = new Float32Array([0.45, 0.9, 0.0, 1.0]);
const GREENL9 = new Float32Array([0.50, 1.0, 0.0, 1.0]);
export const GREENL = [GREENL0, GREENL1, GREENL2, GREENL3, GREENL4, GREENL5, GREENL6, GREENL7, GREENL8, GREENL9,];

const GREEN0 = new Float32Array([0.0, 0.1, 0.0, 1.0]);
const GREEN1 = new Float32Array([0.0, 0.2, 0.0, 1.0]);
const GREEN2 = new Float32Array([0.0, 0.3, 0.0, 1.0]);
const GREEN3 = new Float32Array([0.0, 0.4, 0.0, 1.0]);
const GREEN4 = new Float32Array([0.0, 0.5, 0.0, 1.0]);
const GREEN5 = new Float32Array([0.0, 0.6, 0.0, 1.0]);
const GREEN6 = new Float32Array([0.0, 0.7, 0.0, 1.0]);
const GREEN7 = new Float32Array([0.0, 0.8, 0.0, 1.0]);
const GREEN8 = new Float32Array([0.0, 0.9, 0.0, 1.0]);
const GREEN9 = new Float32Array([0.0, 1.0, 0.0, 1.0]);
export const GREEN = [GREEN0, GREEN1, GREEN2, GREEN3, GREEN4, GREEN5, GREEN6, GREEN7, GREEN8, GREEN9,];

const GREENR0 = new Float32Array([0.0, 0.1, 0.05, 1.0]);
const GREENR1 = new Float32Array([0.0, 0.2, 0.10, 1.0]);
const GREENR2 = new Float32Array([0.0, 0.3, 0.15, 1.0]);
const GREENR3 = new Float32Array([0.0, 0.4, 0.20, 1.0]);
const GREENR4 = new Float32Array([0.0, 0.5, 0.25, 1.0]);
const GREENR5 = new Float32Array([0.0, 0.6, 0.30, 1.0]);
const GREENR6 = new Float32Array([0.0, 0.7, 0.35, 1.0]);
const GREENR7 = new Float32Array([0.0, 0.8, 0.40, 1.0]);
const GREENR8 = new Float32Array([0.0, 0.9, 0.45, 1.0]);
const GREENR9 = new Float32Array([0.0, 1.0, 0.50, 1.0]);
export const GREENR = [GREENR0, GREENR1, GREENR2, GREENR3, GREENR4, GREENR5, GREENR6, GREENR7, GREENR8, GREENR9,];

const YELLOW0 = new Float32Array([0.1, 0.1, 0.0, 1.0]);
const YELLOW1 = new Float32Array([0.2, 0.2, 0.0, 1.0]);
const YELLOW2 = new Float32Array([0.3, 0.3, 0.0, 1.0]);
const YELLOW3 = new Float32Array([0.4, 0.4, 0.0, 1.0]);
const YELLOW4 = new Float32Array([0.5, 0.5, 0.0, 1.0]);
const YELLOW5 = new Float32Array([0.6, 0.6, 0.0, 1.0]);
const YELLOW6 = new Float32Array([0.7, 0.7, 0.0, 1.0]);
const YELLOW7 = new Float32Array([0.8, 0.8, 0.0, 1.0]);
const YELLOW8 = new Float32Array([0.9, 0.9, 0.0, 1.0]);
const YELLOW9 = new Float32Array([1.0, 1.0, 0.0, 1.0]);
export const YELLOW = [YELLOW0, YELLOW1, YELLOW2, YELLOW3, YELLOW4, YELLOW5, YELLOW6, YELLOW7, YELLOW8, YELLOW9,];

const YELLOWR0 = new Float32Array([0.1, 0.075, 0.0, 1.0]);
const YELLOWR1 = new Float32Array([0.2, 0.15, 0.0, 1.0]);
const YELLOWR2 = new Float32Array([0.3, 0.225, 0.0, 1.0]);
const YELLOWR3 = new Float32Array([0.4, 0.3, 0.0, 1.0]);
const YELLOWR4 = new Float32Array([0.5, 0.375, 0.0, 1.0]);
const YELLOWR5 = new Float32Array([0.6, 0.45, 0.0, 1.0]);
const YELLOWR6 = new Float32Array([0.7, 0.525, 0.0, 1.0]);
const YELLOWR7 = new Float32Array([0.8, 0.6, 0.0, 1.0]);
const YELLOWR8 = new Float32Array([0.9, 0.675, 0.0, 1.0]);
const YELLOWR9 = new Float32Array([1.0, 0.65, 0.0, 1.0]);
export const YELLOWR = [YELLOWR0, YELLOWR1, YELLOWR2, YELLOWR3, YELLOWR4, YELLOWR5, YELLOWR6, YELLOWR7, YELLOWR8, YELLOWR9,];

const YELLOWL0 = new Float32Array([0.075, 0.1, 0.0, 1.0]);
const YELLOWL1 = new Float32Array([0.15, 0.2, 0.0, 1.0]);
const YELLOWL2 = new Float32Array([0.225, 0.3, 0.0, 1.0]);
const YELLOWL3 = new Float32Array([0.3, 0.4, 0.0, 1.0]);
const YELLOWL4 = new Float32Array([0.375, 0.5, 0.0, 1.0]);
const YELLOWL5 = new Float32Array([0.45, 0.6, 0.0, 1.0]);
const YELLOWL6 = new Float32Array([0.525, 0.7, 0.0, 1.0]);
const YELLOWL7 = new Float32Array([0.6, 0.8, 0.0, 1.0]);
const YELLOWL8 = new Float32Array([0.675, 0.9, 0.0, 1.0]);
const YELLOWL9 = new Float32Array([0.65, 1.0, 0.0, 1.0]);
export const YELLOWL = [YELLOWL0, YELLOWL1, YELLOWL2, YELLOWL3, YELLOWL4, YELLOWL5, YELLOWL6, YELLOWL7, YELLOWL8, YELLOWL9,];

const GREY0 = new Float32Array([0.04, 0.04, 0.04, 1.0]);
const GREY1 = new Float32Array([0.08, 0.08, 0.08, 1.0]);
const GREY2 = new Float32Array([0.13, 0.13, 0.13, 1.0]);
const GREY3 = new Float32Array([0.2, 0.2, 0.2, 1.0]);
const GREY4 = new Float32Array([0.3, 0.3, 0.3, 1.0]);
const GREY5 = new Float32Array([0.43, 0.43, 0.43, 1.0]);
const GREY6 = new Float32Array([0.5, 0.5, 0.5, 1.0]);
const GREY7 = new Float32Array([0.6, 0.6, 0.6, 1.0]);
const GREY8 = new Float32Array([0.7, 0.7, 0.7, 1.0]);
const GREY9 = new Float32Array([0.8, 0.8, 0.8, 1.0]);
const GREY10 = new Float32Array([0.9, 0.9, 0.9, 1.0]);
export const GREY = [GREY0, GREY1, GREY2, GREY3, GREY4, GREY5, GREY6, GREY7, GREY8, GREY9, GREY10];

const PURPLE0 = new Float32Array([0.1, 0.0, 0.1, 1.0]);
const PURPLE1 = new Float32Array([0.2, 0.0, 0.2, 1.0]);
const PURPLE2 = new Float32Array([0.3, 0.0, 0.3, 1.0]);
const PURPLE3 = new Float32Array([0.4, 0.0, 0.4, 1.0]);
const PURPLE4 = new Float32Array([0.5, 0.0, 0.5, 1.0]);
const PURPLE5 = new Float32Array([0.6, 0.0, 0.6, 1.0]);
const PURPLE6 = new Float32Array([0.7, 0.0, 0.7, 1.0]);
const PURPLE7 = new Float32Array([0.8, 0.0, 0.8, 1.0]);
const PURPLE8 = new Float32Array([0.9, 0.0, 0.9, 1.0]);
const PURPLE9 = new Float32Array([1.0, 0.0, 1.0, 1.0]);
export const PURPLE = [PURPLE0, PURPLE1, PURPLE2, PURPLE3, PURPLE4, PURPLE5, PURPLE6, PURPLE7, PURPLE8, PURPLE9,];

const PURPLEB0 = new Float32Array([0.05, 0.0, 0.1, 1.0]);
const PURPLEB1 = new Float32Array([0.1, 0.0, 0.2, 1.0]);
const PURPLEB2 = new Float32Array([0.15, 0.0, 0.3, 1.0]);
const PURPLEB3 = new Float32Array([0.2, 0.0, 0.4, 1.0]);
const PURPLEB4 = new Float32Array([0.25, 0.0, 0.5, 1.0]);
const PURPLEB5 = new Float32Array([0.3, 0.0, 0.6, 1.0]);
const PURPLEB6 = new Float32Array([0.35, 0.0, 0.7, 1.0]);
const PURPLEB7 = new Float32Array([0.4, 0.0, 0.8, 1.0]);
const PURPLEB8 = new Float32Array([0.45, 0.0, 0.9, 1.0]);
const PURPLEB9 = new Float32Array([0.5, 0.0, 1.0, 1.0]);
export const PURPLEB = [PURPLEB0, PURPLEB1, PURPLEB2, PURPLEB3, PURPLEB4, PURPLEB5, PURPLEB6, PURPLEB7, PURPLEB8, PURPLEB9,];

const PURPLER0 = new Float32Array([0.1, 0.0, 0.05, 1.0]);
const PURPLER1 = new Float32Array([0.2, 0.0, 0.1, 1.0]);
const PURPLER2 = new Float32Array([0.3, 0.0, 0.15, 1.0]);
const PURPLER3 = new Float32Array([0.4, 0.0, 0.2, 1.0]);
const PURPLER4 = new Float32Array([0.5, 0.0, 0.25, 1.0]);
const PURPLER5 = new Float32Array([0.6, 0.0, 0.3, 1.0]);
const PURPLER6 = new Float32Array([0.7, 0.0, 0.35, 1.0]);
const PURPLER7 = new Float32Array([0.8, 0.0, 0.4, 1.0]);
const PURPLER8 = new Float32Array([0.9, 0.0, 0.45, 1.0]);
const PURPLER9 = new Float32Array([1.0, 0.0, 0.5, 1.0]);
export const PURPLER = [PURPLER0, PURPLER1, PURPLER2, PURPLER3, PURPLER4, PURPLER5, PURPLER6, PURPLER7, PURPLER8, PURPLER9,];


export const COLOR_ARRAY3 = [
	BLUEL,
	PURPLEB,
	PURPLER,
	REDL,
	YELLOW,
	ORANGE,
	ORANGEL,
	GREEN,
];
// export const COLOR_ARRAY = {

// 	c1:BLUE[9],		index:0,
// 	c2:GREEN[9],	index:1,	
// 	c3:RED[9],		index:2,
// 	c4:YELLOW[9],	index:3,	
// }
export const COLOR_ARRAY = [

	BLUE[9],
	GREEN[9],
	YELLOW[9],
	RED[9],
	BLUE[9],
	GREEN[9],
	RED[9],
	BLUE[9],
	PURPLE[9],
	RED[9],
	GREY[0],
	GREY[10],
	GREY[0],
]

export function Get_fasma_color(index, max_count, num_colors = 4) {

	let color_wide = max_count / num_colors;
	const overlap = 0;


	const step = (1 / (color_wide + overlap));

	{ // DEBUG-PRINT
		if (index === 0) console.log('max_count', max_count, 'num_colors', num_colors, 'color_wide', color_wide, 'step', step, 'overlap', overlap,)
		if (index === 0)
			for (let i = 0; i < num_colors; i++) {
				const center = color_wide * i;
				console.log(i, ' center:', center)
			}
	}

	const r = [];
	let info_msg = `index:${index} `;
	for (let i = 0; i < num_colors; i++) {

		const color_index = i;
		let center = (color_wide * color_index);
		if(i>1) center = (color_wide * color_index) + color_wide
		// if(i>0) color_wide *= 2
		r[i] = Calculate_color_ratio(index, center, color_wide, step, color_index);

		if (index % color_wide === 0 && i === 0) console.log('-- center:', index,)
		info_msg += `	${r[i].toFixed(2)}  `;
	}

	console.log(info_msg);

	const color = new Float32Array([0, 0, 0, 1]);

	for (let i = 0; i < num_colors; i++) {

		const c = COLOR_ARRAY[i];

		color[0] += c[0] * r[i];
		color[1] += c[1] * r[i];
		color[2] += c[2] * r[i];
	}

	color[0] = Clamp(color[0], 0, 1);
	color[1] = Clamp(color[1], 0, 1);
	color[2] = Clamp(color[2], 0, 1);


	return color;
}
/**SAVE 1 */
// export function Get_fasma_color(index, max_count, num_colors = 4) {

// 	const color_wide = max_count / num_colors;
// 	const overlap = 0;


// 	const step = (1 / (color_wide + overlap));

// 	if (index === 0) console.log('max_count', max_count, 'num_colors', num_colors, 'color_wide', color_wide, 'step', step, 'overlap', overlap,)

// 	if (index === 0)
// 		for (let i = 0; i < num_colors; i++) {
// 			const center = color_wide * i;
// 			console.log(i, ' center:', center)
// 		}

// 	const r = [];
// 	let info_msg = `index:${index} `;
// 	for (let i = 0; i < num_colors; i++) {

// 		const color_index = i;
// 		let center = color_wide * color_index;
// 		// if(i>1) center = (color_wide * color_index) + color_wide
// 		r[i] = Calculate_color_ratio(index, center, color_wide, step, color_index);

// 		if (index % color_wide === 0 && i === 0) console.log('-- center:', index,)
// 		info_msg += `	${r[i].toFixed(2)}  `;
// 	}

// 	console.log(info_msg);

// 	const color = new Float32Array([0, 0, 0, 1]);

// 	for (let i = 0; i < num_colors; i++) {

// 		const c = COLOR_ARRAY[i];

// 		color[0] += c[0] * r[i];
// 		color[1] += c[1] * r[i];
// 		color[2] += c[2] * r[i];
// 	}

// 	color[0] = Clamp(color[0], 0, 1);
// 	color[1] = Clamp(color[1], 0, 1);
// 	color[2] = Clamp(color[2], 0, 1);


// 	return color;
// }

function Calculate_color_ratio(index, color_center, color_wide, step, color_index) {

	const idx = (index <= color_wide) ? index : (index % color_wide);

	let ratio = 0;

	if 		(index <  color_center && index >  color_center - color_wide) ratio = step * idx;
	else if 	(index >= color_center && index <= color_center + color_wide) ratio = 1;
	else if 	(index >  color_center + color_wide && index < color_center + color_wide * 2) ratio = 1 - (step * idx);

	ratio = Clamp(ratio, 0, 1)

	return ratio
}


export function Get_mix_color(index, max_count) {


	if (index === 0) console.log('---------------------------------')

	const num_colors = COLOR_ARRAY.length;
	const blue_color_index = 0;
	const green_color_index = 1;
	const red_color_index = 2;

	const overlap = 0;

	const color_wide = max_count / num_colors;

	const blue_center = (color_wide * blue_color_index);
	const blue_left = blue_center - (color_wide + overlap);
	const blue_right = blue_center + (color_wide + overlap);

	const green_center = (color_wide * green_color_index);
	const green_left = green_center - (color_wide + overlap);
	const green_right = green_center + (color_wide + overlap);

	const red_center = (color_wide * red_color_index);
	const red_left = red_center - (color_wide + overlap);
	const red_right = red_center + (color_wide + overlap);

	// Is color incuded?
	const is_blue_included = (index >= blue_left && index <= blue_right);
	const is_green_included = (index >= green_left && index <= green_right);
	const is_red_included = (index >= red_left && index <= red_right);

	let blue_quantity = 0.0;
	let green_quantity = 0.0;
	let red_quantity = 0.0;





	// How much?
	const step = 1 / (color_wide + overlap);

	if (is_blue_included) {

		if (index < blue_center) {
			blue_quantity = (step * (index - blue_left));
			console.log('<', index, 'blue_quantity', blue_quantity,);
		}
		else {
			blue_quantity = 1 - (step * (index - blue_center));
			console.log('>', index, 'blue_quantity', blue_quantity);
		}
	}
	if (is_green_included) {

		if (index <= green_center) {
			green_quantity = (step * (index - green_left));
			// console.log('<', index, 'green_quantity', green_quantity,);
		}
		else {
			green_quantity = 1 - (step * (index - green_center));
			// console.log('>', index, 'green_quantity', green_quantity);
		}
	}
	if (is_red_included) {

		if (index <= red_center) {
			red_quantity = (step * (index - red_left));
			// console.log('<', index, 'red_quantity', red_quantity,);
		}
		else {
			red_quantity = 1 - (step * (index - red_center));
			// console.log('>', index, 'red_quantity', red_quantity);
		}
	}


	const color = [
		red_quantity,
		green_quantity,
		// 0,
		blue_quantity,
		1.0,
	];
	// console.log('color:', color)

	if (index === max_count - 1) {
		console.log('---------------------------------\n',
			'\nstep', step,
			'\ncolor_widness', color_wide,
			'\nblue  -- length', 'left', blue_left, 'center', blue_center, 'right', blue_right,
			'\ngreen -- length', 'left', green_left, 'center', green_center, 'right', green_right,
			'\nred -- length', 'left', red_left, 'center', red_center, 'right', red_right,
		);
	}


	return color;
}



/*****************************************************************************/
// RGBA 0-255 COLOR SPACE
/*****************************************************************************/


const citf = 1 / 255;
export function Interpolate_rgb_to_01(red, green, blue, alpha = 1) {
	return new Float32Array([citf * red, citf * green, citf * blue, alpha]);
}

const PINK_240_60_160 = Interpolate_rgb_to_01(240, 60, 160);
const PINK_240_60_200 = Interpolate_rgb_to_01(240, 60, 200);
const RED_200_10_10 = Interpolate_rgb_to_01(200, 10, 10);
const GREEN_33_208_40 = Interpolate_rgb_to_01(33, 208, 40);
const GREEN_60_240_100 = Interpolate_rgb_to_01(60, 240, 100);
const GREEN_60_240_60 = Interpolate_rgb_to_01(60, 240, 60);
const GREEN_140_240_10 = Interpolate_rgb_to_01(140, 240, 10);
export const BLUE_10_160_220 = Interpolate_rgb_to_01(10, 160, 220);
export const BLUE_10_120_220 = Interpolate_rgb_to_01(10, 120, 220);
const BLUE_15_130_255 = Interpolate_rgb_to_01(15, 130, 255);
const CYAN_10_200_240 = Interpolate_rgb_to_01(10, 200, 240);
const CYAN_10_230_240 = Interpolate_rgb_to_01(10, 230, 240);
const CYAN_10_230_180 = Interpolate_rgb_to_01(10, 230, 180);
const YELLOW_240_240_10 = Interpolate_rgb_to_01(240, 240, 10);
const YELLOW_240_220_10 = Interpolate_rgb_to_01(240, 200, 10);
export const ORANGE_240_160_10 = Interpolate_rgb_to_01(240, 160, 10);
const ORANGE_240_200_10 = Interpolate_rgb_to_01(240, 200, 10);
const ORANGE_240_130_10 = Interpolate_rgb_to_01(240, 130, 10);
const ORANGE_240_75_10 = Interpolate_rgb_to_01(255, 75, 10);

// const BLUE_LIGHT = Interpolate_rgb_to_01(76, 171, 254);


// export const COLOR_ARRAY = [
// 	PINK_240_60_160,
// 	PINK_240_60_200,
// 	RED_200_10_10,
// 	GREEN_33_208_40,
// 	GREEN_60_240_100,
// 	GREEN_60_240_60,
// 	GREEN_60_240_60,
// 	GREEN_140_240_10,
// 	BLUE_10_160_220,
// 	BLUE_10_120_220,
// 	CYAN_10_200_240,
// 	CYAN_10_230_240,
// 	CYAN_10_230_180,
// 	YELLOW_240_220_10,
// 	YELLOW_240_240_10,
// 	ORANGE_240_75_10,
// 	ORANGE_240_130_10,
// 	ORANGE_240_160_10,
// ];

// export const COLOR_ARRAY2 = [
// 	ORANGE_240_130_10,
// 	PINK_240_60_160,
// 	GREEN_33_208_40,
// 	YELLOW_240_220_10,
// 	BLUE_10_160_220,
// 	CYAN_10_200_240,
// 	CYAN_10_230_240,
// 	YELLOW_240_240_10,
// 	GREEN_140_240_10,
// 	BLUE_10_120_220,
// 	ORANGE_240_160_10,
// 	CYAN_10_230_180,
// 	ORANGE_240_75_10,
// 	RED_200_10_10,
// ];


/**SAVE */
// {
// 	"use strict";




// export const TRANSPARENT = [0.0, 0.0, 0.0, 0.0];
// export const WHITE = [1.0, 1.0, 1.0, 1.0];
// export const BLACK = [0.04, 0.04, 0.04, 1.0];

// // const ORANGE = [1.0, 0.5, 0.0, 1.0];



// const ORANGE0 = [0.1, 0.050, 0.0, 1.0];
// const ORANGE1 = [0.2, 0.100, 0.0, 1.0];
// const ORANGE2 = [0.3, 0.150, 0.0, 1.0];
// const ORANGE3 = [0.4, 0.200, 0.0, 1.0];
// const ORANGE4 = [0.5, 0.250, 0.0, 1.0];
// const ORANGE5 = [0.6, 0.300, 0.0, 1.0];
// const ORANGE6 = [0.7, 0.350, 0.0, 1.0];
// const ORANGE7 = [0.8, 0.400, 0.0, 1.0];
// const ORANGE8 = [0.9, 0.450, 0.0, 1.0];
// const ORANGE9 = [1.0, 0.500, 0.0, 1.0];
// export const ORANGE = [ ORANGE0, ORANGE1, ORANGE2, ORANGE3, ORANGE4, ORANGE5, ORANGE6, ORANGE7, ORANGE8, ORANGE9, ];

// const ORANGEL0 = [0.1, 0.025, 0.0, 1.0];
// const ORANGEL1 = [0.2, 0.050, 0.0, 1.0];
// const ORANGEL2 = [0.3, 0.075, 0.0, 1.0];
// const ORANGEL3 = [0.4, 0.100, 0.0, 1.0];
// const ORANGEL4 = [0.5, 0.125, 0.0, 1.0];
// const ORANGEL5 = [0.6, 0.150, 0.0, 1.0];
// const ORANGEL6 = [0.7, 0.175, 0.0, 1.0];
// const ORANGEL7 = [0.8, 0.200, 0.0, 1.0];
// const ORANGEL8 = [0.9, 0.225, 0.0, 1.0];
// const ORANGEL9 = [1.0, 0.250, 0.0, 1.0];
// export const ORANGEL = [ ORANGEL0, ORANGEL1, ORANGEL2, ORANGEL3, ORANGEL4, ORANGEL5, ORANGEL6, ORANGEL7, ORANGEL8, ORANGEL9, ];



// const ORANGER0 = [0.1, 0.075, 0.0, 1.0];
// const ORANGER1 = [0.2, 0.150, 0.0, 1.0];
// const ORANGER2 = [0.3, 0.150, 0.0, 1.0];
// const ORANGER3 = [0.4, 0.225, 0.0, 1.0];
// const ORANGER4 = [0.5, 0.300, 0.0, 1.0];
// const ORANGER5 = [0.6, 0.374, 0.0, 1.0];
// const ORANGER6 = [0.7, 0.450, 0.0, 1.0];
// const ORANGER7 = [0.8, 0.525, 0.0, 1.0];
// const ORANGER8 = [0.9, 0.600, 0.0, 1.0];
// const ORANGER9 = [1.0, 0.675, 0.0, 1.0];
// export const ORANGER = [ ORANGER0, ORANGER1, ORANGER2, ORANGER3, ORANGER4, ORANGER5, ORANGER6, ORANGER7, ORANGER8, ORANGER9, ];


// const RED0 = [0.1, 0.0, 0.0, 1.0];
// const RED1 = [0.2, 0.0, 0.0, 1.0];
// const RED2 = [0.3, 0.0, 0.0, 1.0];
// const RED3 = [0.4, 0.0, 0.0, 1.0];
// const RED4 = [0.5, 0.0, 0.0, 1.0];
// const RED5 = [0.6, 0.0, 0.0, 1.0];
// const RED6 = [0.7, 0.0, 0.0, 1.0];
// const RED7 = [0.8, 0.0, 0.0, 1.0];
// const RED8 = [0.9, 0.0, 0.0, 1.0];
// const RED9 = [1.0, 0.0, 0.0, 1.0];
// export const RED = [ RED0, RED1, RED2, RED3, RED4, RED5, RED6, RED7, RED8, RED9, ];

// const REDL0 = [0.1, 0.01, 0.0, 1.0];
// const REDL1 = [0.2, 0.02, 0.0, 1.0];
// const REDL2 = [0.3, 0.03, 0.0, 1.0];
// const REDL3 = [0.4, 0.04, 0.0, 1.0];
// const REDL4 = [0.5, 0.05, 0.0, 1.0];
// const REDL5 = [0.6, 0.06, 0.0, 1.0];
// const REDL6 = [0.7, 0.07, 0.0, 1.0];
// const REDL7 = [0.8, 0.08, 0.0, 1.0];
// const REDL8 = [0.9, 0.09, 0.0, 1.0];
// const REDL9 = [1.0, 0.10, 0.0, 1.0];
// export const REDL = [ REDL0, REDL1, REDL2, REDL3, REDL4, REDL5, REDL6, REDL7, REDL8, REDL9, ];

// const BLUE0 = [0.0, 0.0, 0.1, 1.0];
// const BLUE1 = [0.0, 0.0, 0.2, 1.0];
// const BLUE2 = [0.0, 0.0, 0.3, 1.0];
// const BLUE3 = [0.0, 0.0, 0.4, 1.0];
// const BLUE4 = [0.0, 0.0, 0.5, 1.0];
// const BLUE5 = [0.0, 0.0, 0.6, 1.0];
// const BLUE6 = [0.0, 0.0, 0.7, 1.0];
// const BLUE7 = [0.0, 0.0, 0.8, 1.0];
// const BLUE8 = [0.0, 0.0, 0.9, 1.0];
// const BLUE9 = [0.0, 0.0, 1.0, 1.0];
// export const BLUE = [ BLUE0, BLUE1, BLUE2, BLUE3, BLUE4, BLUE5, BLUE6, BLUE7, BLUE8, BLUE9, ];

// const BLUEL0 = [0.0, 0.05 , 0.1, 1.0];
// const BLUEL1 = [0.0, 0.10, 0.2, 1.0];
// const BLUEL2 = [0.0, 0.15, 0.3, 1.0];
// const BLUEL3 = [0.0, 0.20, 0.4, 1.0];
// const BLUEL4 = [0.0, 0.25, 0.5, 1.0];
// const BLUEL5 = [0.0, 0.30, 0.6, 1.0];
// const BLUEL6 = [0.0, 0.35, 0.7, 1.0];
// const BLUEL7 = [0.0, 0.40, 0.8, 1.0];
// const BLUEL8 = [0.0, 0.45, 0.9, 1.0];
// const BLUEL9 = [0.0, 0.50, 1.0, 1.0];
// export const BLUEL = [ BLUEL0, BLUEL1, BLUEL2, BLUEL3, BLUEL4, BLUEL5, BLUEL6, BLUEL7, BLUEL8, BLUEL9, ];

// const BLUER0 = [0.015, 0.05 , 0.1, 1.0];
// const BLUER1 = [0.030, 0.10, 0.2, 1.0];
// const BLUER2 = [0.045, 0.15, 0.3, 1.0];
// const BLUER3 = [0.060, 0.20, 0.4, 1.0];
// const BLUER4 = [0.075, 0.25, 0.5, 1.0];
// const BLUER5 = [0.090, 0.30, 0.6, 1.0];
// const BLUER6 = [0.105, 0.35, 0.7, 1.0];
// const BLUER7 = [0.120, 0.40, 0.8, 1.0];
// const BLUER8 = [0.135, 0.45, 0.9, 1.0];
// const BLUER9 = [0.150, 0.50, 1.0, 1.0];
// export const BLUER = [ BLUER0, BLUER1, BLUER2, BLUER3, BLUER4, BLUER5, BLUER6, BLUER7, BLUER8, BLUER9, ];


// const GREEN0 = [0.0, 0.1, 0.0, 1.0];
// const GREEN1 = [0.0, 0.2, 0.0, 1.0];
// const GREEN2 = [0.0, 0.3, 0.0, 1.0];
// const GREEN3 = [0.0, 0.4, 0.0, 1.0];
// const GREEN4 = [0.0, 0.5, 0.0, 1.0];
// const GREEN5 = [0.0, 0.6, 0.0, 1.0];
// const GREEN6 = [0.0, 0.7, 0.0, 1.0];
// const GREEN7 = [0.0, 0.8, 0.0, 1.0];
// const GREEN8 = [0.0, 0.9, 0.0, 1.0];
// const GREEN9 = [0.0, 1.0, 0.0, 1.0];
// export const GREEN = [ GREEN0, GREEN1, GREEN2, GREEN3, GREEN4, GREEN5, GREEN6, GREEN7, GREEN8, GREEN9, ];

// const YELLOW0 = [0.1, 0.1, 0.0, 1.0];
// const YELLOW1 = [0.2, 0.2, 0.0, 1.0];
// const YELLOW2 = [0.3, 0.3, 0.0, 1.0];
// const YELLOW3 = [0.4, 0.4, 0.0, 1.0];
// const YELLOW4 = [0.5, 0.5, 0.0, 1.0];
// const YELLOW5 = [0.6, 0.6, 0.0, 1.0];
// const YELLOW6 = [0.7, 0.7, 0.0, 1.0];
// const YELLOW7 = [0.8, 0.8, 0.0, 1.0];
// const YELLOW8 = [0.9, 0.9, 0.0, 1.0];
// const YELLOW9 = [1.0, 1.0, 0.0, 1.0];
// export const YELLOW = [ YELLOW0, YELLOW1, YELLOW2, YELLOW3, YELLOW4, YELLOW5, YELLOW6, YELLOW7, YELLOW8, YELLOW9, ];

// const YELLOWR0 = [0.1, 0.075, 0.0, 1.0];
// const YELLOWR1 = [0.2, 0.15 , 0.0, 1.0];
// const YELLOWR2 = [0.3, 0.225, 0.0, 1.0];
// const YELLOWR3 = [0.4, 0.3  , 0.0, 1.0];
// const YELLOWR4 = [0.5, 0.375, 0.0, 1.0];
// const YELLOWR5 = [0.6, 0.45 , 0.0, 1.0];
// const YELLOWR6 = [0.7, 0.525, 0.0, 1.0];
// const YELLOWR7 = [0.8, 0.6  , 0.0, 1.0];
// const YELLOWR8 = [0.9, 0.675, 0.0, 1.0];
// const YELLOWR9 = [1.0, 0.65 , 0.0, 1.0];
// export const YELLOWR = [ YELLOWR0, YELLOWR1, YELLOWR2, YELLOWR3, YELLOWR4, YELLOWR5, YELLOWR6, YELLOWR7, YELLOWR8, YELLOWR9, ];

// const YELLOWL0 = [0.095, 0.1, 0.0, 1.0];
// const YELLOWL1 = [0.17 , 0.2, 0.0, 1.0];
// const YELLOWL2 = [0.245, 0.3, 0.0, 1.0];
// const YELLOWL3 = [0.32 , 0.4, 0.0, 1.0];
// const YELLOWL4 = [0.395, 0.5, 0.0, 1.0];
// const YELLOWL5 = [0.47 , 0.6, 0.0, 1.0];
// const YELLOWL6 = [0.545, 0.7, 0.0, 1.0];
// const YELLOWL7 = [0.62 , 0.8, 0.0, 1.0];
// const YELLOWL8 = [0.695, 0.9, 0.0, 1.0];
// const YELLOWL9 = [0.95 , 1.0, 0.0, 1.0];
// export const YELLOWL = [ YELLOWL0, YELLOWL1, YELLOWL2, YELLOWL3, YELLOWL4, YELLOWL5, YELLOWL6, YELLOWL7, YELLOWL8, YELLOWL9, ];

// const GREY0 = [0.05, 0.05, 0.05, 1.0];
// const GREY1 = [0.13, 0.13, 0.13, 1.0];
// const GREY2 = [0.2,  0.2, 0.2, 1.0];
// const GREY3 = [0.3,  0.3, 0.3, 1.0];
// const GREY4 = [0.43, 0.43, 0.43, 1.0];
// const GREY5 = [0.5,  0.5, 0.5, 1.0];
// const GREY6 = [0.6,  0.6, 0.6, 1.0];
// const GREY7 = [0.7,  0.7, 0.7, 1.0];
// const GREY8 = [0.8,  0.8, 0.8, 1.0];
// const GREY9 = [0.9,  0.9, 0.9, 1.0];
// export const GREY = [ GREY0, GREY1, GREY2, GREY3, GREY4, GREY5, GREY6, GREY7, GREY8, GREY9, ];

// const PURPLE0 = [0.1, 0.0, 0.1, 1.0];
// const PURPLE1 = [0.2, 0.0, 0.2, 1.0];
// const PURPLE2 = [0.3, 0.0, 0.3, 1.0];
// const PURPLE3 = [0.4, 0.0, 0.4, 1.0];
// const PURPLE4 = [0.5, 0.0, 0.5, 1.0];
// const PURPLE5 = [0.6, 0.0, 0.6, 1.0];
// const PURPLE6 = [0.7, 0.0, 0.7, 1.0];
// const PURPLE7 = [0.8, 0.0, 0.8, 1.0];
// const PURPLE8 = [0.9, 0.0, 0.9, 1.0];
// const PURPLE9 = [1.0, 0.0, 1.0, 1.0];
// export const PURPLE = [ PURPLE0, PURPLE1, PURPLE2, PURPLE3, PURPLE4, PURPLE5, PURPLE6, PURPLE7, PURPLE8, PURPLE9, ];

// const PURPLEB0 = [0.05, 0.0, 0.1, 1.0];
// const PURPLEB1 = [0.1 , 0.0, 0.2, 1.0];
// const PURPLEB2 = [0.15, 0.0, 0.3, 1.0];
// const PURPLEB3 = [0.2 , 0.0, 0.4, 1.0];
// const PURPLEB4 = [0.25, 0.0, 0.5, 1.0];
// const PURPLEB5 = [0.3 , 0.0, 0.6, 1.0];
// const PURPLEB6 = [0.35, 0.0, 0.7, 1.0];
// const PURPLEB7 = [0.4 , 0.0, 0.8, 1.0];
// const PURPLEB8 = [0.45, 0.0, 0.9, 1.0];
// const PURPLEB9 = [0.5 , 0.0, 1.0, 1.0];
// export const PURPLEB = [ PURPLEB0, PURPLEB1, PURPLEB2, PURPLEB3, PURPLEB4, PURPLEB5, PURPLEB6, PURPLEB7, PURPLEB8, PURPLEB9, ];

// const PURPLER0 = [0.1, 0.0, 0.05, 1.0];
// const PURPLER1 = [0.2, 0.0, 0.1 , 1.0];
// const PURPLER2 = [0.3, 0.0, 0.15, 1.0];
// const PURPLER3 = [0.4, 0.0, 0.2 , 1.0];
// const PURPLER4 = [0.5, 0.0, 0.25, 1.0];
// const PURPLER5 = [0.6, 0.0, 0.3 , 1.0];
// const PURPLER6 = [0.7, 0.0, 0.35, 1.0];
// const PURPLER7 = [0.8, 0.0, 0.4 , 1.0];
// const PURPLER8 = [0.9, 0.0, 0.45, 1.0];
// const PURPLER9 = [1.0, 0.0, 0.5 , 1.0];
// export const PURPLER = [ PURPLER0, PURPLER1, PURPLER2, PURPLER3, PURPLER4, PURPLER5, PURPLER6, PURPLER7, PURPLER8, PURPLER9, ];


// export const COLOR_ARRAY3 = [
// 	ORANGE,
// 	BLUEL,
// 	ORANGEL,
// 	PURPLEB,
// 	PURPLER,
// 	REDL,
// 	YELLOW,
// 	GREEN,
// ];



// /*****************************************************************************/
// // RGBA 0-255 COLOR SPACE
// /*****************************************************************************/


// const citf = 1 / 255;
// function Interpolate_rgb_to_01(red, green, blue) {
// 	return [citf * red, citf * green, citf * blue, 1.0];
// }

// const PINK_240_60_160 = Interpolate_rgb_to_01(240, 60, 160);
// const PINK_240_60_200 = Interpolate_rgb_to_01(240, 60, 200);
// const RED_200_10_10 = Interpolate_rgb_to_01(200, 10, 10);
// const GREEN_33_208_40 = Interpolate_rgb_to_01(33, 208, 40);
// const GREEN_60_240_100 = Interpolate_rgb_to_01(60, 240, 100);
// const GREEN_60_240_60 = Interpolate_rgb_to_01(60, 240, 60);
// const GREEN_140_240_10 = Interpolate_rgb_to_01(140, 240, 10);
// export const BLUE_10_160_220 = Interpolate_rgb_to_01(10, 160, 220);
// export const BLUE_10_120_220 = Interpolate_rgb_to_01(10, 120, 220);
// const BLUE_15_130_255 = Interpolate_rgb_to_01(15, 130, 255);
// const CYAN_10_200_240 = Interpolate_rgb_to_01(10, 200, 240);
// const CYAN_10_230_240 = Interpolate_rgb_to_01(10, 230, 240);
// const CYAN_10_230_180 = Interpolate_rgb_to_01(10, 230, 180);
// const YELLOW_240_240_10 = Interpolate_rgb_to_01(240, 240, 10);
// const YELLOW_240_220_10 = Interpolate_rgb_to_01(240, 200, 10);
// export const ORANGE_240_160_10 = Interpolate_rgb_to_01(240, 160, 10);
// const ORANGE_240_200_10 = Interpolate_rgb_to_01(240, 200, 10);
// const ORANGE_240_130_10 = Interpolate_rgb_to_01(240, 130, 10);
// const ORANGE_240_75_10 = Interpolate_rgb_to_01(255, 75, 10);

// const BLUE_LIGHT = Interpolate_rgb_to_01(76, 171, 254);


// export const COLOR_ARRAY = [
// 	PINK_240_60_160,
// 	PINK_240_60_200,
// 	RED_200_10_10,
// 	GREEN_33_208_40,
// 	GREEN_60_240_100,
// 	GREEN_60_240_60,
// 	GREEN_60_240_60,
// 	GREEN_140_240_10,
// 	BLUE_10_160_220,
// 	BLUE_10_120_220,
// 	CYAN_10_200_240,
// 	CYAN_10_230_240,
// 	CYAN_10_230_180,
// 	YELLOW_240_220_10,
// 	YELLOW_240_240_10,
// 	ORANGE_240_75_10,
// 	ORANGE_240_130_10,
// 	ORANGE_240_160_10,
// ];

// export const COLOR_ARRAY2 = [
// 	ORANGE_240_130_10,
// 	PINK_240_60_160,
// 	GREEN_33_208_40,
// 	YELLOW_240_220_10,
// 	BLUE_10_160_220,
// 	CYAN_10_200_240,
// 	CYAN_10_230_240,
// 	YELLOW_240_240_10,
// 	GREEN_140_240_10,
// 	BLUE_10_120_220,
// 	ORANGE_240_160_10,
// 	CYAN_10_230_180,
// 	ORANGE_240_75_10,
// 	RED_200_10_10,
// ];


// }