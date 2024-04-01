







export function Get_name_from_mesh_type(type) {

	let meshType = []

	if (type & MESH_TYPE.GEOMETRY2D) { meshType.push('Geometry2D'); }
	if (type & MESH_TYPE.TEXT_GEOMETRY2D) { meshType.push('Geometry2D_Text'); }
	if (type & MESH_TYPE.GEOMETRY3D) { meshType.push('Geometry3D'); }
	if (type & MESH_TYPE.CUBE_GEOMETRY) { meshType.push('CubeGeometry'); }
	if (type & MESH_TYPE.MATERIAL) { meshType.push('Material'); }
	if (type & MESH_TYPE.FONT_MATERIAL) { meshType.push('FontMaterial'); }
	if (type & MESH_TYPE.MESH) { meshType.push('Mesh'); }
	if (type & MESH_TYPE.TEXT_MESH) { meshType.push('Text_Mesh'); }
	if (type & MESH_TYPE.RECT_MESH) { meshType.push('RECT_MESH'); }
	if (type & MESH_TYPE.SECTION_MESH) { meshType.push('SECTION_MESH'); }
	if (type & MESH_TYPE.WIDGET_LABEL) { meshType.push('Widget_Label'); }
	if (type & MESH_TYPE.Widget_Label_Text_Mesh_Menu_Options) { meshType = 'Widget_Label_Text_Mesh_Menu_Options'; }
	if (type & MESH_TYPE.WIDGET_BUTTON) { meshType.push('Widget_Button'); }
	if (type & MESH_TYPE.WIDGET_SWITCH) { meshType.push('Widget_Switch'); }
	if (type & MESH_TYPE.WIDGET_TEXT) { meshType.push('Widget_Text'); }
	if (type & MESH_TYPE.WIDGET_TEXT_DYNAMIC) { meshType.push('Widget_Dynamic_Text_Mesh'); }
	if (type & MESH_TYPE.WIDGET_SLIDER) { meshType.push('WIDGET_SLIDER'); }
	if (type & MESH_TYPE.WIDGET_SLIDER_BAR) { meshType.push('WIDGET_SLIDER_BAR'); }
	if (type & MESH_TYPE.WIDGET_SLIDER_HANDLE) { meshType.push('WIDGET_SLIDER_HANDLE'); }
	if (type & MESH_TYPE.WIDGET_POP_UP) { meshType.push('WIDGET_POP_UP'); }

	return meshType;
}