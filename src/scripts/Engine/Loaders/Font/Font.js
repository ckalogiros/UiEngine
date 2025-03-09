// "use strict";
// // import { comic_sans_cz } from '../../../../../resources/fonts/comic_sans_ms/comicz.js';
// // import { CONSOLAS_40Hpx } from '../../../../../resources/fonts/consolas_10/metrics/consolas_10.js';
// // import { CONSOLAS_49Hpx } from '../../../../../resources/fonts/consolas_12/metrics/consolas_12.js';
// // import { CONSOLAS_58Hpx } from '../../../../../resources/fonts/consolas_14/metrics/consolas_14.js';
// // import { CONSOLAS_66Hpx } from '../../../../../resources/fonts/consolas_16/metrics/consolas_16.js';
// // import { CONSOLAS_116Hpx } from '../../../../../resources/fonts/consolas_28/metrics/consolas_28.js';
// // import { CONSOLAS_12Hpx } from '../../../../../resources/fonts/consolas_3/metrics/consolas_3.js';
// // import { CONSOLAS_157Hpx } from '../../../../../resources/fonts/consolas_38/metrics/consolas_38.js';
// // import { CONSOLAS_16Hpx } from '../../../../../resources/fonts/consolas_4/metrics/consolas_4.js';
// // import { CONSOLAS_20Hpx } from '../../../../../resources/fonts/consolas_5/metrics/consolas_5.js';
// // import { CONSOLAS_24Hpx } from '../../../../../resources/fonts/consolas_6/metrics/consolas_6.js';
// // import { CONSOLAS_28Hpx } from '../../../../../resources/fonts/consolas_7/metrics/consolas_7.js';
// // import { CONSOLAS_32Hpx } from '../../../../../resources/fonts/consolas_8/metrics/consolas_8.js';
// // import { consola_msdf_test_1024_metrics } from '../../../../../resources/fonts/consolas_sdf/metrics/consola_msdf_test_1024_metrics.js';
// // import { arrow_left } from '../../../../../resources/fonts/symbol_fonts/test_symbol_fonts/arrow_left_256x256.js';
// import { Metrics_loader_load_chlumsky_msdf_metrics } from './ChlumskyFontMetricsLoader.js';



// // POTENTIAL_BUG: 
// // The font texture buffer is build specificaly for fonts, but it gets the font textures from the application's texture buffer.
// // So the indexing is not guarantee to be 1to1 (texture buffer-font buffer).
// // It will work only if the font textures in the texture buffer preceding all the regular textures in the texture buffer



// // The maximum number of characters for ASCII
// const ASCII_NUM_CHARACTERS = '~'.charCodeAt(0) - (' '.charCodeAt(0));
// const FONTS_MAX_COUNT = TEXTURES.TEXTURE_ATLASES_COUNT; 

// var _font_metrics_buffer = []; // Indexed via metrics_idx (SEE Material.js).
// var _font_uvmaps_buffer = [];  // Indexed via metrics_idx (SEE Material.js).
// var _font_active_textures_buffer = new Int8Array(FONTS_MAX_COUNT); // Indexed via texture_file_id (SEE: TEXTURES global object)




// // /** The 'metrics' variables are fixed, but because the 'TEXTURE_PATHS' is a global variable, the 'metrics' fiels must be set in a function enviroment */
// // // Connect the image textures with their apropriate metrics file
// // let counter = 0;
// // export function Texture_metrics_resolve_metric_files_pairing() {

// // 	TEXTURE_PATHS[counter++].metrics = CONSOLAS_12Hpx;
// // 	TEXTURE_PATHS[counter++].metrics = CONSOLAS_16Hpx;
// // 	TEXTURE_PATHS[counter++].metrics = CONSOLAS_20Hpx;
// // 	TEXTURE_PATHS[counter++].metrics = CONSOLAS_24Hpx;
// // 	TEXTURE_PATHS[counter++].metrics = CONSOLAS_28Hpx;
// // 	TEXTURE_PATHS[counter++].metrics = CONSOLAS_32Hpx;
// // 	TEXTURE_PATHS[counter++].metrics = CONSOLAS_40Hpx;
// // 	TEXTURE_PATHS[counter++].metrics = CONSOLAS_49Hpx;
// // 	TEXTURE_PATHS[counter++].metrics = CONSOLAS_58Hpx;
// // 	TEXTURE_PATHS[counter++].metrics = CONSOLAS_66Hpx;
// // 	TEXTURE_PATHS[counter++].metrics = CONSOLAS_116Hpx;
// // 	TEXTURE_PATHS[counter++].metrics = CONSOLAS_157Hpx;
// // 	TEXTURE_PATHS[counter++].metrics = consola_msdf_test_1024_metrics;
// // 	TEXTURE_PATHS[counter++].metrics = comic_sans_cz;
// // 	TEXTURE_PATHS[counter++].metrics = arrow_left;

// // }

// export function Font_texture_reset_buffers() {
// 	_font_metrics_buffer = [];
// 	_font_uvmaps_buffer = [];
// 	_font_active_textures_buffer = new Int8Array(FONTS_MAX_COUNT); 
// }

// export function Font_texture_init_buffers() {
// 	// Initialize active fonts buffer
// 	for(let i=0; i<FONTS_MAX_COUNT; i++) {
// 		_font_active_textures_buffer[i] = INT_NULL;
// 	}
// }



// function Font_get_metrics_by_texid(texture_file_id){
//    switch(texture_file_id){
// 		case TEXTURES.CONSOLAS_12px: return CONSOLAS_12Hpx;
//       case TEXTURES.CONSOLAS_16px: return CONSOLAS_16Hpx;
//       case TEXTURES.CONSOLAS_20px: return CONSOLAS_20Hpx;
//       case TEXTURES.CONSOLAS_24px: return CONSOLAS_24Hpx;
//       case TEXTURES.CONSOLAS_28px: return CONSOLAS_28Hpx;
//       case TEXTURES.CONSOLAS_32px: return CONSOLAS_32Hpx;
//       case TEXTURES.CONSOLAS_40px: return CONSOLAS_40Hpx;
//       case TEXTURES.CONSOLAS_49px: return CONSOLAS_49Hpx;
//       case TEXTURES.CONSOLAS_58px: return CONSOLAS_58Hpx;
//       case TEXTURES.CONSOLAS_66px: return CONSOLAS_66Hpx;
//       case TEXTURES.CONSOLAS_116px: return CONSOLAS_116Hpx;
//       case TEXTURES.CONSOLAS_157px: return CONSOLAS_157Hpx;
//       case TEXTURES.MSDF_CONSOLAS_1024: return consola_msdf_test_1024_metrics;
//       case TEXTURES.MSDF_COMIC_1024: return comic_sans_cz;
//       case TEXTURES.ARROW_LEFT: return arrow_left;
//       default: alert('NO FONT METRICS FOUND. WRONG TEXID OR TEXTURE NOT ADDED TO THE SWITCH CASE. texture_file_id:', texture_file_id);
//    }
// }



// export function Font_create_uvmap(texture_file_id){

//    Font_get_metrics_by_texid(texture_file_id); 
// }



// export function Font_create_storage_buffer_font() {


// 	const metrics = {
// 		ch: [],
// 		size: 0,
// 		texWidth: 0,
// 		texHeight: 0,
// 		row_height: 0,
// 		advancex: 0, // Start (in pixels) of curr character unti the start of next character(in the texture)
// 		padding: 0,
// 		isMonoSpace: 0, // In non monospace fonts, the advancex variable is different from char to char (compare to monospace fonts)
// 		ratio: 0,
// 	};

// 	// New uvMap for every font
// 	const uvMap = [];
	
// 	// New font metrics for every character
// 	for (let j = 0; j <= ASCII_NUM_CHARACTERS; j++) {
		
// 		metrics.ch[j] = {
// 			left: 0,
// 			right: 0,
// 			top: 0,
// 			bottom: 0,
// 			advancex: 0,
// 			width: 0,
// 			height: 0,
// 			// bearingtop: 0,
// 			// bearingleft: 0,
// 			ratio: 0, // Ratio width to height, for each character's. Used for non monospace fonts
// 		};
// 		// New uv coordinates for every character
// 		uvMap[j] = [0,0,0,0];
// 	}


// 	return {
// 		metrics:metrics,
// 		uvMap:uvMap,
// 	};
// }



// export function Font_is_loaded(texture_file_id) {
// 	if (_font_active_textures_buffer[texture_file_id] === INT_NULL) return false;
// 	return true;
// }



// export function Font_retrieve_fontidx(texture_file_id) {
// 	return _font_active_textures_buffer[texture_file_id];
// }



// /**
//  * UV Coordinates Getters
//  */
// export function Font_get_uv_coords(font_idx, ch) {
	
// 	return _font_uvmaps_buffer[font_idx][ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET];
// }



// export function FontGetFontDimRatio(font_idx) {
// 	return _font_metrics_buffer[font_idx].ratio;
// }



// export function Uv_metrics_get_face_advancex(font_idx) { return _font_metrics_buffer[font_idx].advancex; }
// export function Font_metrics_get_texture_width(font_idx) { return _font_metrics_buffer[font_idx].texWidth; }
// export function Font_metrics_get_texture_height(font_idx) { return _font_metrics_buffer[font_idx].texHeight; }
// export function Font_metrics_get_char_width(font_idx, ch) { return _font_metrics_buffer[font_idx].ch[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].width; }
// export function Font_metrics_get_char_height(font_idx, ch) { return _font_metrics_buffer[font_idx].ch[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].row_height; }
// export function Font_metrics_get_row_height(font_idx) { return _font_metrics_buffer[font_idx].row_height; }
// export function Font_metrics_get_interpolated_x(font_idx) { return 1.0 / _font_metrics_buffer[font_idx].texWidth; } // Transform to 0-1 coords 

// export function Font_metrics_calculate_width_from_text(str, font_idx){

//    let width = 0;
// 	const len = str.length;
// 	for(let i=0; i<len; i++){

// 		width += Font_metrics_get_char_width(font_idx, str[i]);
// 	}

//    return width;
// }


// export function Font_load_uvs(texture_file_id) {

// 	// Create new font metrics and uvmap
// 	const font_idx = _font_uvmaps_buffer.length;
// 	_font_active_textures_buffer[texture_file_id] = font_idx; // Update the 'active' fonts
	
	
// 	if(FONT_IS_MSDF(texture_file_id)) {
		
// 		const msdf_metrics = Metrics_loader_load_chlumsky_msdf_metrics(texture_file_id);
// 		_font_metrics_buffer[font_idx] = msdf_metrics;
// 		_font_uvmaps_buffer[font_idx] =  msdf_metrics.uvmap
		
// 		console.log(
// 			'==========================================================================',
// 			'Load Font:', TEXTURE_PATHS[texture_file_id].img_name,
// 			'Metrics:', _font_metrics_buffer[font_idx],
// 			'Active Fonts idxs:', _font_active_textures_buffer,
// 		)
// 	}
// 	else {
		
// 		console.log(
// 			'==========================================================================',
// 			'Load Font:', TEXTURE_PATHS[texture_file_id].img_name,
// 			'Metrics:', _font_metrics_buffer[font_idx],
// 			'Active Fonts idxs:', _font_active_textures_buffer,
// 		)

// 		// Create new font metrics and uvmap
// 		const ret = Font_create_storage_buffer_font();
// 		_font_metrics_buffer[font_idx] = ret.metrics
// 		_font_uvmaps_buffer[font_idx] = ret.uvMap;
// 		Metrics_loader_load_custom_metrics(font_idx, texture_file_id);
// 		Create_uv_map(font_idx);
		
// 	}
	
// 	return font_idx;
// }



// // Read the text file using 'filePos' as guide of word-line
// const filePos = { start: 0, end: 0, len: 0, line: 0 };
// function Metrics_loader_load_custom_metrics(font_idx, texture_file_id) {

// 	const metrics = _font_metrics_buffer[font_idx];

// 	const file = { content: '', name: '', pos: filePos, size: 0, };
// 	file.content = TEXTURE_PATHS[texture_file_id].metrics; 
// 	file.size = file.content.length;


// 	let size = 0;
// 	// Get how many characters the font texture has 
// 	// by retrieving the line: "NumCharacters		:	[94]"
// 	file.pos = Find_field_by_name(file.content, "NumCharacters", file.pos);
// 	if (file.pos.len) size = Find_next_field(file, "[]");
// 	size++; // +1 for the ' ' space char

// 	metrics.size = size;
	
	
// 	file.pos = Find_field_by_name(file.content, "Image Width", file.pos);
// 	if (file.pos.len) {
// 		metrics.texWidth = Find_next_field(file, "[]");
// 		// The next val inside [] is the height 
// 		metrics.texHeight = Find_next_field(file, "[]");
// 		metrics.row_height = Find_next_field(file, "[]");
// 	}

// 	// In monospace {Only} the advance x is the same for every character
// 	metrics.advancex = Find_next_field(file, "[]");
// 	// Space between the characters in the texture font
// 	metrics.padding = Find_next_field(file, "[]");

// 	file.pos = Find_field_by_name(file.content, "Mono Space", file.pos);
// 	metrics.isMonoSpace = Find_next_field(file, "[]");
// 	metrics.ratio = metrics.texHeight / metrics.advancex;

// 	let ii = 0;

// 	/**
// 	 * // TODO: Set the start character=10->\n,
// 	 * leave emty array elements to the ' '=32
// 	 */
// 	// For char space character ' '
// 	metrics.ch[ii].left = 0;
// 	metrics.ch[ii].right = 0;
// 	metrics.ch[ii].top = 0;
// 	metrics.ch[ii].bottom = 0;
// 	metrics.ch[ii].width = metrics.advancex;
// 	metrics.ch[ii].height = 0;
// 	metrics.ch[ii].row_num = 0;
// 	if (!metrics.isMonoSpace) {
// 		metrics.ch[ii].advancex = metrics.advancex;
// 		metrics.ch[ii].ratio = metrics.texHeight / metrics.ch[0].advancex; // width to height ratio(and not the other way arround)
// 	}

// 	ii++;

// 	// Reset the file's pos
// 	file.pos.start = 0;

// 	// Load all property values to character map for each character
// 	for (let i = ii; i < size; i++) {
// 		file.pos = Find_field_by_name(file.content, "Face Left", file.pos);
// 		if (file.pos.len)
// 			metrics.ch[i].left = Find_next_field(file, "[]");

// 		// Because the file.pos retains the start position
// 		// we just call Find_next_field() to  get the next val
// 		metrics.ch[i].right 			= Find_next_field(file, "[]");
// 		metrics.ch[i].top 			= Find_next_field(file, "[]");
// 		metrics.ch[i].bottom 		= Find_next_field(file, "[]");
// 		metrics.ch[i].width 			= Find_next_field(file, "[]");
// 		metrics.ch[i].height 		= Find_next_field(file, "[]");
// 		metrics.ch[i].row_num 		= Find_next_field(file, "[]");
// 		metrics.ch[i].bearingleft 	= Find_next_field(file, "[]");
// 		metrics.ch[i].bearingtop 	= Find_next_field(file, "[]");
// 		if (!metrics.isMonoSpace) {
// 			metrics.ch[i].advancex = Find_next_field(file, "[]");
// 			metrics.ch[i].ratio = metrics.ch[i].height / metrics.ch[i].width; // width to height ratio(and not the other way arround)
// 		}
// 	}

// 	if(DEBUG.UVS){ console.log('metrics', metrics); }
// 	return font_idx;
// }



// function Create_uv_map(font_idx, uvMap) {

// 	const metrics = _font_metrics_buffer[font_idx]; 
	
// 	const uvmap = _font_uvmaps_buffer[font_idx];

// 	let transormedU = 1.0 / metrics.texWidth;	// Transform to 0-1 coords
// 	let transormedV = 1.0 / metrics.texHeight;	// Transform to 0-1 coords

// 	const U1 = 0, U2 = 1, V1 = 2, V2 = 3;
// 	for (let j = 0; j < metrics.size; j++) {
		
// 		const uv = metrics.ch[j]; // Get a characters pixel position in the font texture.
		
// 		// and store them to the uvmap
// 		uvmap[j] = [0.0, 0.0, 0.0, 0.0]; //  Create new uvs for each character
// 		uvmap[j][U1] = transormedU * uv.left;
// 		uvmap[j][U2] = transormedU * uv.right;
// 		uvmap[j][V1] = metrics.row_height * transormedV * (uv.row_num);
// 		uvmap[j][V2] = uvmap[j][V1] + (metrics.row_height * transormedV);
		
// 		// Round for any potential floating-point rounding errors
// 		const round = 100000;
// 		uvmap[j][V1] = Math.round(uvmap[j][V1] * round) / round;
// 		uvmap[j][V2] = Math.round(uvmap[j][V2] * round) / round;
// 		uvmap[j][U1] = Math.round(uvmap[j][U1] * round) / round;
// 		uvmap[j][U2] = Math.round(uvmap[j][U2] * round) / round;
// 	}

// 	if(DEBUG.UVS){ console.log('uvmap:', uvmap); }
	
// 	return uvmap;
// }



// /*
// 	Finds text between delimiters, in a string buffer.
// */
// function Find_next_field(file, delim) {
// 	/**
// 	 * pos reference's indexes in the string buffer.
// 	 * 		pos.start:   the start index of the searched text in the string buffer
// 	 * 		pos.end:     the end index of the searched text in the string buffer
// 	 * 		pos.len:     the length of the searched text in the string buffer
// 	 * 		pos.line:    the line of the searched text in the string buffer
// 	 */
// 	let pos = file.pos;

// 	// Cash values
// 	const data = file.content;
// 	let i = file.pos.start;

// 	// Find first delim
// 	while (data[i++] != delim[0]) {
// 		if (data[i] == '\n')
// 			file.pos.line++;
// 		if (i >= file.size) {
// 			console.error("Delimiter does not exist. Returning");
// 			return -1;
// 		}
// 	}
// 	pos.start = i;

// 	// Store to "charval" whatever lies in between the two delimiter characters
// 	let charval = '';
// 	let k = 0;
// 	while (data[i] != delim[1]) {
// 		charval += data[i];
// 		pos.len++;
// 		i++; k++;
// 		if (i >= file.size) {
// 			console.error("No value found. Reached the end of file.");
// 		}
// 	}
// 	pos.end = i - 1;

// 	// Store the "charval's" position (in the string buffer) to file.pos object
// 	file.pos.start = pos.start;
// 	file.pos.end = pos.end;
// 	file.pos.len = pos.len;

// 	// Convert String to Number
// 	let val = 0;
// 	for (i = 0; i < k; i++)
// 		val = val * 10 + (charval[i] - '0');

// 	return val;
// }



// function Find_field_by_name(file, word, pos) {

// 	const wordpos = { start: -1, end: -1, len: 0, line: -1 };
// 	const wordlen = word.length;
	
// 	let line = pos.line;
// 	let i = pos.start;
	
// 	const filelen = file.length;
// 	while (i <= filelen) {

// 		let k = 0;
// 		if (file[i] == '\n') line++;

// 		if (file[i] == word[k]) {

// 			wordpos.start = i;
// 			wordpos.len = 0;
// 			i++; k++;

// 			while (file[i] == word[k]) {

// 				wordpos.len++;
// 				if (k >= wordlen - 1) {
// 					wordpos.line = line;
// 					wordpos.len++;
// 					wordpos.end = i + 1;
// 					return wordpos;
// 				}
// 				i++; k++;
// 			}
// 		}
// 		i++;
// 	}
// 	return wordpos;
// }




  



















// /**
//    texture:
//       type        : obj.atlas.type,
//       width       : texture_width, 
//       height      : texture_height, 
//       ascender    : obj.metrics.ascender,
//       descender   : obj.metrics.descender,
//       advance     : advance, // For monospace fonts
//       line_height : obj.metrics.lineHeight,
//       base_line   : base_line,
// */
// export function Msdf_Uv_get_char_uv_coords(fontIdx, ch) { return _font_metrics_buffer[fontIdx].uvmap[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET]; }
// export function Msdf_Font_get_char_plane_bounds(fontIdx, ch) { return _font_metrics_buffer[fontIdx].plane_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET]; }
// export function Msdf_Font_get_char_atlas_bounds(fontIdx, ch) { return _font_metrics_buffer[fontIdx].atlas_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET]; }
// export function Msdf_Font_get_atlas_texture_metrics(fontIdx) { return _font_metrics_buffer[fontIdx].texture; }
// export function Msdf_Uv_get_font_line_height(fontIdx) { return _font_metrics_buffer[fontIdx].texture.line_height; }
// export function Msdf_Uv_get_font_advancex(fontIdx) { return _font_metrics_buffer[fontIdx].texture.advance; }
// export function Msdf_Uv_get_font_base_line(fontIdx) { return _font_metrics_buffer[fontIdx].texture.base_line; }




// /**
//    plane_bounds[i]:
//       left:    glyphs[i].planeBounds.left,
//       right:   glyphs[i].planeBounds.right,
//       top:     glyphs[i].planeBounds.top,
//       bottom:  glyphs[i].planeBounds.bottom,
//       width:   glyphs[i].planeBounds.right-glyphs[i].planeBounds.left,
//       height:  glyphs[i].planeBounds.bottom-glyphs[i].planeBounds.top,
// */
// export function Msdf_ont_get_char_plane_bounds_width(fontIdx, ch) { 
// 	return _font_metrics_buffer[fontIdx].plane_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].width; 
// }
// export function Msdf_ont_get_char_plane_bounds_height(fontIdx, ch) { 
// 	return _font_metrics_buffer[fontIdx].plane_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].height; 
// }
// export function Msdf_ont_get_char_plane_bounds_left(fontIdx, ch) { 
// 	return _font_metrics_buffer[fontIdx].plane_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].left; 
// }
// export function Msdf_ont_get_char_plane_bounds_right(fontIdx, ch) { 
// 	return _font_metrics_buffer[fontIdx].plane_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].right; 
// }
// export function Msdf_ont_get_char_plane_bounds_top(fontIdx, ch) { 
// 	return _font_metrics_buffer[fontIdx].plane_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].top; 
// }
// export function Msdf_ont_get_char_plane_bounds_bottom(fontIdx, ch) { 
// 	return _font_metrics_buffer[fontIdx].plane_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].bottom; 
// }

// /**
//    atlas_bounds[i]:
//       left:    glyphs[i].planeBounds.left,
//       right:   glyphs[i].planeBounds.right,
//       top:     glyphs[i].planeBounds.top,
//       bottom:  glyphs[i].planeBounds.bottom,
//       width:   glyphs[i].planeBounds.right-glyphs[i].planeBounds.left,
//       height:  glyphs[i].planeBounds.bottom-glyphs[i].planeBounds.top,
//       yoffset: -((ascender-glyphs[i].planeBounds.top)+(descender-glyphs[i].planeBounds.bottom)) * scale,
//    */
// export function Msdf_ont_get_char_atlas_bounds_width(fontIdx, ch) { return _font_metrics_buffer[fontIdx].atlas_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].width; }
// export function Msdf_ont_get_char_atlas_bounds_height(fontIdx, ch) { return _font_metrics_buffer[fontIdx].atlas_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].height; }
// export function Msdf_ont_get_char_atlas_bounds_left(fontIdx, ch) { return _font_metrics_buffer[fontIdx].atlas_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].left; }
// export function Msdf_ont_get_char_atlas_bounds_right(fontIdx, ch) { return _font_metrics_buffer[fontIdx].atlas_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].right; }
// export function Msdf_ont_get_char_atlas_bounds_top(fontIdx, ch) { return _font_metrics_buffer[fontIdx].atlas_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].top; }
// export function Msdf_ont_get_char_atlas_bounds_bottom(fontIdx, ch) { return _font_metrics_buffer[fontIdx].atlas_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].bottom; }
















// /**Debug-Print */
// export function Font_print() {
// 	/**
// 		const FONTS_MAX_COUNT = TEXTURES.TEXTURE_ATLASES_COUNT; 
// 		const _font_metrics_buffer = [];
// 		const _font_uvmaps_buffer = [];
// 		const _font_active_textures_buffer = new Int8Array(FONTS_MAX_COUNT); 
// 	*/
// 	console.log(
// 		'----------------------------------- Fonts -----------------------------------', 
// 		'\nMetrics', _font_metrics_buffer,
// 		'\nActive Font idxs', _font_active_textures_buffer,
// 		'\nUvMaps', _font_uvmaps_buffer,
// 	);
// }