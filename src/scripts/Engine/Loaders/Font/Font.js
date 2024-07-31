"use strict";
import { COMIC_FONT_METRICS } from './ComicFontMetrics.js'
import { CONSOLAS_12Hpx } from '../../../../../resources/fonts/consolas_3/metrics/consolas_3.js';
import { CONSOLAS_16Hpx } from '../../../../../resources/fonts/consolas_4/metrics/consolas_4.js';
import { CONSOLAS_20Hpx } from '../../../../../resources/fonts/consolas_5/metrics/consolas_5.js';
import { CONSOLAS_24Hpx } from '../../../../../resources/fonts/consolas_6/metrics/consolas_6.js';
import { CONSOLAS_28Hpx } from '../../../../../resources/fonts/consolas_7/metrics/consolas_7.js';
import { CONSOLAS_32Hpx } from '../../../../../resources/fonts/consolas_8/metrics/consolas_8.js';



// POTENTIAL_BUG: 
// The font texture buffer is build specificaly for fonts, but it gets the font textures from the application's texture buffer.
// So the indexing is not guarantee to be 1to1 (texture buffer-font buffer).
// It will work only if the font textures in the texture buffer preceding all the regular textures in the texture buffer



// The maximum number of characters for ASCII
const ASCII_NUM_CHARACTERS = '~'.charCodeAt(0) - (' '.charCodeAt(0));
const FONTS_MAX_COUNT = TEXTURES.FONT_COUNT; 

const _fontMetricsBuffer = [];
const _fontsUvMap = [];
const _activeFontTextures = new Int8Array(FONTS_MAX_COUNT); 




/** The 'metrics' variables are fixed, but because the 'TEXTURE_PATHS' is a global variable, the 'metrics' fiels must be set in a function enviroment */
// Connect the image textures with their apropriate metrics file
export function Font_texture_images_set_metrics_file() {

	TEXTURE_PATHS[0].metrics = COMIC_FONT_METRICS;
	TEXTURE_PATHS[1].metrics = CONSOLAS_12Hpx;
	TEXTURE_PATHS[2].metrics = CONSOLAS_16Hpx;
	TEXTURE_PATHS[3].metrics = CONSOLAS_20Hpx;
	TEXTURE_PATHS[4].metrics = CONSOLAS_24Hpx;
	TEXTURE_PATHS[5].metrics = CONSOLAS_28Hpx;
	TEXTURE_PATHS[6].metrics = CONSOLAS_32Hpx;
}



export function Font_create_storage_buffer_font() {


	const metrics = {
		ch: [],
		size: 0,
		texWidth: 0,
		texHeight: 0,
		row_height: 0,
		advancex: 0, // Start (in pixels) of curr character unti the start of next character(in the texture)
		padding: 0,
		isMonoSpace: 0, // In non monospace fonts, the advancex variable is different from char to char (compare to monospace fonts)
		ratio: 0,
	};

	// New uvMap for every font
	const uvMap = [];
	
	// New font metrics for every character
	for (let j = 0; j <= ASCII_NUM_CHARACTERS; j++) {
		
		metrics.ch[j] = {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			advancex: 0,
			width: 0,
			height: 0,
			// bearingtop: 0,
			// bearingleft: 0,
			ratio: 0, // Ratio width to height, for each character's. Used for non monospace fonts
		};
		// New uv coordinates for every character
		uvMap[j] = [0,0,0,0];
	}

	return {
		metrics:metrics,
		uvMap:uvMap,
	};
}



export function Font_is_loaded(textureid) {
	if (_activeFontTextures[textureid] === INT_NULL) return false;
	return true;
}



export function Font_retrieve_fontidx(textureid) {
	return _activeFontTextures[textureid];
}



/**
 * UV Coordinates Getters
 */
export function Font_get_uv_coords(font_idx, ch) {
	
	return _fontsUvMap[font_idx][ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET];
}



export function FontGetFontDimRatio(font_idx) {
	return _fontMetricsBuffer[font_idx].ratio;
}



export function Font_metrics_get_advancex(font_idx) { return _fontMetricsBuffer[font_idx].advancex; }
export function Font_metrics_get_width(font_idx) { return _fontMetricsBuffer[font_idx].texWidth; }
export function Font_metrics_get_char_width(font_idx, ch) { return _fontMetricsBuffer[font_idx].ch[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].width; }
export function Font_metrics_get_height(font_idx) { return _fontMetricsBuffer[font_idx].texHeight; }
export function Font_metrics_get_row_height(font_idx) { return _fontMetricsBuffer[font_idx].row_height; }
export function Font_metrics_get_interpolated_x(font_idx) { return 1.0 / _fontMetricsBuffer[font_idx].texWidth; } // Transform to 0-1 coords 




export function Font_load_uvs(textureid) {

	// Create new font metrics and uvmap
	const ret = Font_create_storage_buffer_font();

	const font_idx = _fontMetricsBuffer.push(ret.metrics) -1;
	_activeFontTextures[textureid] = font_idx; // Update the 'active' fonts

	const uvmap_idx = _fontsUvMap.push(ret.uvMap) -1;


	if(font_idx !== uvmap_idx) alert('6111282237 \nFont index and uvmap index must be equual.');


	LoadMetrics(font_idx, textureid);
	Create_uv_map(font_idx);
	// console.log('--------------------------------------------------------------------\n', _fontMetricsBuffer[font_idx])
	console.log('--------------------------------------------------------------------\n', _fontMetricsBuffer, _fontsUvMap)
	
	return font_idx;
}





// Read the text file using 'filePos' as guide of word-line
const filePos = { start: 0, end: 0, len: 0, line: 0 };
function LoadMetrics(font_idx, textureid) {

	const metrics = _fontMetricsBuffer[font_idx];

	const file = { content: '', name: '', pos: filePos, size: 0, };
	file.content = TEXTURE_PATHS[textureid].metrics; 
	file.size = file.content.length;


	let size = 0;
	// Get how many characters the font texture has 
	// by retrieving the line: "NumCharacters		:	[94]"
	file.pos = FindWord(file.content, "NumCharacters", file.pos);
	if (file.pos.len) size = FindNextValue(file, "[]");
	size++; // +1 for the ' ' space char

	metrics.size = size;
	
	
	file.pos = FindWord(file.content, "Image Width", file.pos);
	if (file.pos.len) {
		metrics.texWidth = FindNextValue(file, "[]");
		// The next val inside [] is the height 
		metrics.texHeight = FindNextValue(file, "[]");
		metrics.row_height = FindNextValue(file, "[]");
	}

	// In monospace {Only} the advance x is the same for every character
	metrics.advancex = FindNextValue(file, "[]");
	// Space between the characters in the texture font
	metrics.padding = FindNextValue(file, "[]");

	file.pos = FindWord(file.content, "Mono Space", file.pos);
	metrics.isMonoSpace = FindNextValue(file, "[]");
	metrics.ratio = metrics.texHeight / metrics.advancex;

	let ii = 0;

	/**
	 * // TODO: Set the start character=10->\n,
	 * leave emty array elements to the ' '=32
	 */
	// For char space character ' '
	metrics.ch[ii].left = 0;
	metrics.ch[ii].right = 0;
	metrics.ch[ii].top = 0;
	metrics.ch[ii].bottom = 0;
	metrics.ch[ii].width = metrics.advancex;
	metrics.ch[ii].height = 0;
	metrics.ch[ii].row_num = 0;
	if (!metrics.isMonoSpace) {
		metrics.ch[ii].advancex = metrics.advancex;
		metrics.ch[ii].ratio = metrics.texHeight / metrics.ch[0].advancex; // width to height ratio(and not the other way arround)
	}

	ii++;

	// Reset the file's pos
	file.pos.start = 0;

	// Load all property values to character map for each character
	for (let i = ii; i < size; i++) {
		file.pos = FindWord(file.content, "Face Left", file.pos);
		if (file.pos.len)
			metrics.ch[i].left = FindNextValue(file, "[]");

		// Because the file.pos retains the start position
		// we just call FindNextValue() to  get the next val
		metrics.ch[i].right 			= FindNextValue(file, "[]");
		metrics.ch[i].top 			= FindNextValue(file, "[]");
		metrics.ch[i].bottom 		= FindNextValue(file, "[]");
		metrics.ch[i].width 			= FindNextValue(file, "[]");
		metrics.ch[i].height 		= FindNextValue(file, "[]");
		metrics.ch[i].row_num 		= FindNextValue(file, "[]");
		metrics.ch[i].bearingleft 	= FindNextValue(file, "[]");
		metrics.ch[i].bearingtop 	= FindNextValue(file, "[]");
		if (!metrics.isMonoSpace) {
			metrics.ch[i].advancex = FindNextValue(file, "[]");
			metrics.ch[i].ratio = metrics.ch[i].height / metrics.ch[i].width; // width to height ratio(and not the other way arround)
		}
	}

	if(DEBUG.UVS){ console.log('metrics', metrics); }
	return font_idx;
}



function Create_uv_map(font_idx) {

	const metrics = _fontMetricsBuffer[font_idx]; 
	const uvmap = _fontsUvMap[font_idx];

	let transormedU = 1.0 / metrics.texWidth;	// Transform to 0-1 coords
	if (metrics.advancex % 2) {
		metrics.advancex++;
		transormedU = 1.0 / (metrics.texWidth);	// Deal with odd width. 
	}

	let transormedV = 1.0 / metrics.texHeight;	// Transform to 0-1 coords
	if (metrics.texHeight % 2) {
		metrics.texHeight++;
		transormedV = 1.0 / (metrics.texHeight);	// Deal with odd width. 
	}

	const U1 = 0, U2 = 1, V1 = 2, V2 = 3;
	for (let j = 0; j < metrics.size; j++) {

		const uv = metrics.ch[j]; // Get a characters pixel position in the font texture.

		// and store them to the uvmap
		uvmap[j] = [0.0, 0.0, 0.0, 0.0]; //  Create new array for each character
		uvmap[j][U1] = transormedU * uv.left;
		uvmap[j][U2] = transormedU * uv.right;

		/** Sqeeze the uv left and right, by the left and right emty space of the font */
		// let scalex = (metrics.advancex - uv.width) / 2;
		// uvmap[j][U1] -= transormedU * scalex * .5; // HACK: The correct calculation is to remove the *.5
		// uvmap[j][U2] += transormedU * scalex * .5; // HACK: The correct calculation is to remove the *.5


		/** Transformations for the top-bottom */
		// uvmap[j][V1] = transormedV * uv.top;
		// uvmap[j][V2] = transormedV * uv.bottom;

		// let scaley = (metrics.row_height - uv.height) / 2;
		// uvmap[j][V1] -= transormedU * scaley;
		// uvmap[j][V2] += transormedU * scaley;

		uvmap[j][V1] = metrics.row_height * transormedV * (uv.row_num);
		uvmap[j][V2] = uvmap[j][V1] + (metrics.row_height * transormedV);
		// uvmap[j][V2] = (metrics.row_height * transormedV * (uv.row_num+1));
		// console.log(j, 'uv.row_num+1', uv.row_num+1)

		if (metrics.texHeight % 2)
			uvmap[j][V1] += transormedV;
	}

	if(DEBUG.UVS){ console.log('uvmap:', uvmap); }
	
	return uvmap;
}



/*
	Finds text between delimiters, in a string buffer.
*/
function FindNextValue(file, delim) {
	/**
	 * pos reference's indexes in the string buffer.
	 * 		pos.start:   the start index of the searched text in the string buffer
	 * 		pos.end:     the end index of the searched text in the string buffer
	 * 		pos.len:     the length of the searched text in the string buffer
	 * 		pos.line:    the line of the searched text in the string buffer
	 */
	let pos = file.pos;

	// Cash values
	const data = file.content;
	let i = file.pos.start;

	// Find first delim
	while (data[i++] != delim[0]) {
		if (data[i] == '\n')
			file.pos.line++;
		if (i >= file.size) {
			console.error("Delimiter does not exist. Returning");
			return -1;
		}
	}
	pos.start = i;

	// Store to "charval" whatever lies in between the two delimiter characters
	let charval = '';
	let k = 0;
	while (data[i] != delim[1]) {
		charval += data[i];
		pos.len++;
		i++; k++;
		if (i >= file.size) {
			console.error("No value found. Reached the end of file.");
		}
	}
	pos.end = i - 1;

	// Store the "charval's" position (in the string buffer) to file.pos object
	file.pos.start = pos.start;
	file.pos.end = pos.end;
	file.pos.len = pos.len;

	// Convert String to Number
	let val = 0;
	for (i = 0; i < k; i++)
		val = val * 10 + (charval[i] - '0');

	return val;
}



function FindWord(file, word, pos) {

	const wordpos = { start: -1, end: -1, len: 0, line: -1 };
	const wordlen = word.length;
	
	let line = pos.line;
	let i = pos.start;
	
	const filelen = file.length;
	while (i <= filelen) {

		let k = 0;
		if (file[i] == '\n') line++;

		if (file[i] == word[k]) {

			wordpos.start = i;
			wordpos.len = 0;
			i++; k++;

			while (file[i] == word[k]) {

				wordpos.len++;
				if (k >= wordlen - 1) {
					wordpos.line = line;
					wordpos.len++;
					wordpos.end = i + 1;
					return wordpos;
				}
				i++; k++;
			}
		}
		i++;
	}
	return wordpos;
}




  