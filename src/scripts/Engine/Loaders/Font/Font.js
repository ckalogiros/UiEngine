"use strict";
import { comic_sans_ms_gras } from '../../../../../resources/fonts/comic_sans_ms/metrics/comicsansmsgras.js';
import { comic_sans_cz } from '../../../../../resources/fonts/comic_sans_ms/comicz.js';
import { CONSOLAS_40Hpx } from '../../../../../resources/fonts/consolas_10/metrics/consolas_10.js';
import { CONSOLAS_49Hpx } from '../../../../../resources/fonts/consolas_12/metrics/consolas_12.js';
import { CONSOLAS_58Hpx } from '../../../../../resources/fonts/consolas_14/metrics/consolas_14.js';
import { CONSOLAS_66Hpx } from '../../../../../resources/fonts/consolas_16/metrics/consolas_16.js';
import { CONSOLAS_116Hpx } from '../../../../../resources/fonts/consolas_28/metrics/consolas_28.js';
import { CONSOLAS_12Hpx } from '../../../../../resources/fonts/consolas_3/metrics/consolas_3.js';
import { CONSOLAS_157Hpx } from '../../../../../resources/fonts/consolas_38/metrics/consolas_38.js';
import { CONSOLAS_16Hpx } from '../../../../../resources/fonts/consolas_4/metrics/consolas_4.js';
import { CONSOLAS_20Hpx } from '../../../../../resources/fonts/consolas_5/metrics/consolas_5.js';
import { CONSOLAS_24Hpx } from '../../../../../resources/fonts/consolas_6/metrics/consolas_6.js';
import { CONSOLAS_28Hpx } from '../../../../../resources/fonts/consolas_7/metrics/consolas_7.js';
import { CONSOLAS_32Hpx } from '../../../../../resources/fonts/consolas_8/metrics/consolas_8.js';
import { consola_msdf_test_1024_metrics } from '../../../../../resources/fonts/consolas_sdf/metrics/consola_msdf_test_1024_metrics.js';
import { Load_msdf_font_metrics } from './ChlumskyFontMetricsLoader.js';



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
let counter = 0;
export function Font_texture_images_init_metrics_files() {

	TEXTURE_PATHS[counter++].metrics = CONSOLAS_12Hpx;
	TEXTURE_PATHS[counter++].metrics = CONSOLAS_16Hpx;
	TEXTURE_PATHS[counter++].metrics = CONSOLAS_20Hpx;
	TEXTURE_PATHS[counter++].metrics = CONSOLAS_24Hpx;
	TEXTURE_PATHS[counter++].metrics = CONSOLAS_28Hpx;
	TEXTURE_PATHS[counter++].metrics = CONSOLAS_32Hpx;
	TEXTURE_PATHS[counter++].metrics = CONSOLAS_40Hpx;
	TEXTURE_PATHS[counter++].metrics = CONSOLAS_49Hpx;
	TEXTURE_PATHS[counter++].metrics = CONSOLAS_58Hpx;
	TEXTURE_PATHS[counter++].metrics = CONSOLAS_66Hpx;
	TEXTURE_PATHS[counter++].metrics = CONSOLAS_116Hpx;
	TEXTURE_PATHS[counter++].metrics = CONSOLAS_157Hpx;
	TEXTURE_PATHS[counter++].metrics = consola_msdf_test_1024_metrics;
	TEXTURE_PATHS[counter++].metrics = comic_sans_cz;
	// TEXTURE_PATHS[counter++].metrics = comic_sans_ms_gras;
}

function Font_get_metrics_by_texid(texture_id){
   switch(texture_id){
		case TEXTURES.CONSOLAS_12px: return CONSOLAS_12Hpx;
      case TEXTURES.CONSOLAS_16px: return CONSOLAS_16Hpx;
      case TEXTURES.CONSOLAS_20px: return CONSOLAS_20Hpx;
      case TEXTURES.CONSOLAS_24px: return CONSOLAS_24Hpx;
      case TEXTURES.CONSOLAS_28px: return CONSOLAS_28Hpx;
      case TEXTURES.CONSOLAS_32px: return CONSOLAS_32Hpx;
      case TEXTURES.CONSOLAS_40px: return CONSOLAS_40Hpx;
      case TEXTURES.CONSOLAS_49px: return CONSOLAS_49Hpx;
      case TEXTURES.CONSOLAS_58px: return CONSOLAS_58Hpx;
      case TEXTURES.CONSOLAS_66px: return CONSOLAS_66Hpx;
      case TEXTURES.CONSOLAS_116px: return CONSOLAS_116Hpx;
      case TEXTURES.CONSOLAS_157px: return CONSOLAS_157Hpx;
      case TEXTURES.MSDF_CONSOLAS_1024: return consola_msdf_test_1024_metrics;
      case TEXTURES.MSDF_COMIC_1024: return comic_sans_cz;
      default: alert('NO FONT METRICS FOUND. WRONG TEXID OR TEXTURE NOT ADDED TO THE SWITCH CASE. texture_id:', texture_id);
   }
}



export function Font_create_uvmap(texture_id){

   Font_get_metrics_by_texid(texture_id); 
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



export function Font_metrics_get_face_advancex(font_idx) { return _fontMetricsBuffer[font_idx].advancex; }
export function Font_metrics_get_texture_width(font_idx) { return _fontMetricsBuffer[font_idx].texWidth; }
export function Font_metrics_get_texture_height(font_idx) { return _fontMetricsBuffer[font_idx].texHeight; }
export function Font_metrics_get_char_width(font_idx, ch) { return _fontMetricsBuffer[font_idx].ch[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].width; }
export function Font_metrics_get_char_height(font_idx, ch) { return _fontMetricsBuffer[font_idx].ch[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].height; }
export function Font_metrics_get_row_height(font_idx) { return _fontMetricsBuffer[font_idx].row_height; }
export function Font_metrics_get_interpolated_x(font_idx) { return 1.0 / _fontMetricsBuffer[font_idx].texWidth; } // Transform to 0-1 coords 

export function Font_metrics_calculate_width_from_text(str, font_idx){

   let width = 0;
	const len = str.length;
	for(let i=0; i<len; i++){

		width += Font_metrics_get_char_width(font_idx, str[i]);
	}

   return width;
}


export function Font_load_uvs(textureid) {

	// Create new font metrics and uvmap
	const ret = Font_create_storage_buffer_font();

	const font_idx = _fontMetricsBuffer.push(ret.metrics) -1;
	_activeFontTextures[textureid] = font_idx; // Update the 'active' fonts

	const uvmap_idx = _fontsUvMap.push(ret.uvMap) -1;


	if(font_idx !== uvmap_idx) alert('6111282237 \nFont index and uvmap index must be equual.');


	if(textureid === TEXTURES.MSDF_CONSOLAS_1024) {
		
		const msdf_uvmap = Load_metrics_msdf(font_idx, textureid);
		// Load_metrics_msdf(font_idx, textureid);
		// _fontsUvMap[font_idx] = msdf_uvmap;
		Create_uv_map(font_idx);
		// {
		// 	imgPath: 'fonts/consolas_3',
		// 	imgName: FONT_CONSOLAS_12px,
		// 	imgType: 'bmp',
		// 	metrics: null, 
		// },
		console.log(
			'==========================================================================',
			'Load Font:', TEXTURE_PATHS[textureid].imgName,
		)
	}
	else {
		
		console.log(
			'==========================================================================',
			'Load Font:', TEXTURE_PATHS[textureid].imgName,
		)
		Load_metrics(font_idx, textureid);
		Create_uv_map(font_idx);

	}
	
	return font_idx;
}


function Load_metrics_msdf(font_idx, textureid) {

	const msdf_metrics = Load_msdf_font_metrics(textureid);
	const metrics = _fontMetricsBuffer[font_idx];


	const len = metrics.ch.length;

	// CAUTION: The Chlumsky msdf metrics gives advance value as a ratio
	const advancex = msdf_metrics.texture.advance;

	for(let i = 0; i < len; i++) {

		metrics.ch[i].left = msdf_metrics.atlas_bounds[i].left; 
		metrics.ch[i].right = msdf_metrics.atlas_bounds[i].right; 
		metrics.ch[i].top = msdf_metrics.atlas_bounds[i].top; 
		metrics.ch[i].bottom = msdf_metrics.atlas_bounds[i].bottom; 
		metrics.ch[i].height = msdf_metrics.atlas_bounds[i].height; 
		metrics.ch[i].width = msdf_metrics.atlas_bounds[i].width; 
		metrics.ch[i].advancex = msdf_metrics.atlas_bounds[i].width; 
		// metrics.ch[i].ratio = msdf_metrics.atlas_bounds[i].left; 
		if(metrics.ch[i].row_num===undefined) metrics.ch[i].row_num = 1;  // HACK: temporary for drawing sdf font
	}

	metrics.texWidth = msdf_metrics.texture.width;
	metrics.texHeight = msdf_metrics.texture.height;
	metrics.advancex = 0;
	metrics.size = msdf_metrics.atlas_bounds.length;
	if(metrics.row_height===0) metrics.row_height = 148; // HACK: temporary for drawing sdf font
	// metrics.ratio = metrics.texHeight / metrics.ch[0].advancex;
	metrics.ratio = 1;
	metrics.padding =  0;
	metrics.isMonoSpace = false;

	if(DEBUG.UVS){ console.log('metrics', metrics, '\nmsdf_metrics', msdf_metrics); }


	return msdf_metrics.uvmap;
}


// Read the text file using 'filePos' as guide of word-line
const filePos = { start: 0, end: 0, len: 0, line: 0 };
function Load_metrics(font_idx, textureid) {

	const metrics = _fontMetricsBuffer[font_idx];

	const file = { content: '', name: '', pos: filePos, size: 0, };
	file.content = TEXTURE_PATHS[textureid].metrics; 
	file.size = file.content.length;


	let size = 0;
	// Get how many characters the font texture has 
	// by retrieving the line: "NumCharacters		:	[94]"
	file.pos = Find_field_by_name(file.content, "NumCharacters", file.pos);
	if (file.pos.len) size = Find_next_field(file, "[]");
	size++; // +1 for the ' ' space char

	metrics.size = size;
	
	
	file.pos = Find_field_by_name(file.content, "Image Width", file.pos);
	if (file.pos.len) {
		metrics.texWidth = Find_next_field(file, "[]");
		// The next val inside [] is the height 
		metrics.texHeight = Find_next_field(file, "[]");
		metrics.row_height = Find_next_field(file, "[]");
	}

	// In monospace {Only} the advance x is the same for every character
	metrics.advancex = Find_next_field(file, "[]");
	// Space between the characters in the texture font
	metrics.padding = Find_next_field(file, "[]");

	file.pos = Find_field_by_name(file.content, "Mono Space", file.pos);
	metrics.isMonoSpace = Find_next_field(file, "[]");
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
		file.pos = Find_field_by_name(file.content, "Face Left", file.pos);
		if (file.pos.len)
			metrics.ch[i].left = Find_next_field(file, "[]");

		// Because the file.pos retains the start position
		// we just call Find_next_field() to  get the next val
		metrics.ch[i].right 			= Find_next_field(file, "[]");
		metrics.ch[i].top 			= Find_next_field(file, "[]");
		metrics.ch[i].bottom 		= Find_next_field(file, "[]");
		metrics.ch[i].width 			= Find_next_field(file, "[]");
		metrics.ch[i].height 		= Find_next_field(file, "[]");
		metrics.ch[i].row_num 		= Find_next_field(file, "[]");
		metrics.ch[i].bearingleft 	= Find_next_field(file, "[]");
		metrics.ch[i].bearingtop 	= Find_next_field(file, "[]");
		if (!metrics.isMonoSpace) {
			metrics.ch[i].advancex = Find_next_field(file, "[]");
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
	// if (metrics.advancex % 2) {
	// 	metrics.advancex++;
	// 	transormedU = 1.0 / (metrics.texWidth);	// Deal with odd width. 
	// }
	
	let transormedV = 1.0 / metrics.texHeight;	// Transform to 0-1 coords
	// if (metrics.texHeight % 2) {
	// 	metrics.texHeight++;
	// 	transormedV = 1.0 / (metrics.texHeight);	// Deal with odd height. 
	// }


	const U1 = 0, U2 = 1, V1 = 2, V2 = 3;
	for (let j = 0; j < metrics.size; j++) {
		
		const uv = metrics.ch[j]; // Get a characters pixel position in the font texture.
		
		// and store them to the uvmap
		uvmap[j] = [0.0, 0.0, 0.0, 0.0]; //  Create new uvs for each character
		uvmap[j][U1] = transormedU * uv.left;
		uvmap[j][U2] = transormedU * uv.right;
		uvmap[j][V1] = metrics.row_height * transormedV * (uv.row_num);
		uvmap[j][V2] = uvmap[j][V1] + (metrics.row_height * transormedV);
		// uvmap[j][U1] = transormedU * 0;
		// uvmap[j][U2] = transormedU * 100;
		// uvmap[j][V1] = transormedV * 0;
		// uvmap[j][V2] = transormedV * 148;
		
		// if (metrics.texHeight % 2)
		// 	uvmap[j][V1] += transormedV;
		
		// Round for any potential floating-point rounding errors
		const round = 100000;
		uvmap[j][V1] = Math.round(uvmap[j][V1] * round) / round;
		uvmap[j][V2] = Math.round(uvmap[j][V2] * round) / round;
		uvmap[j][U1] = Math.round(uvmap[j][U1] * round) / round;
		uvmap[j][U2] = Math.round(uvmap[j][U2] * round) / round;
	}

	if(DEBUG.UVS){ console.log('uvmap:', uvmap); }
	
	return uvmap;
}



/*
	Finds text between delimiters, in a string buffer.
*/
function Find_next_field(file, delim) {
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



function Find_field_by_name(file, word, pos) {

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




  