"use strict";


import { Shader_attributes_get_attrib_offset_by_nameid, Shader_attributes_get_attribs_offset_size } from "../Graphics/ShaderAttributes.js";
import { Vertex_buffer_get_by_vbidx, Vertex_buffer_info_get_by_vbidx, Vertex_buffer_state_enable } from "../Graphics/Buffers/VertexBuffers.js";














/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Add vertex attributes from buffer(buffer with already calculated values).
 * The repeat is used if we have a repeated attribute, like world position which is the same x,y,z for every vertex.
 */
// export function VbSetAttribBuffer(vb, start, count, stride, buffer, attribSize) {

//     let cnt = start;
//     let len = buffer.length;
//     let cnt2 = 0;

//     for (let i = 0; i < count; i += stride) {
//         for (let j = 0; j < attribSize; j++) {
//             vb[cnt++] = buffer[cnt2++];
//             vb.count++;
//             if (cnt2 >= len) cnt2 = 0;
//         }

//         cnt += stride - attribSize;
//     }
// }




/****************************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************************/






/****************************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************************/






// export function GlRotateZ2D(gfxInfo, dim, angle) {

//     const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
//     const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES

//     let index = gfxInfo.vb.start + offset;
//     let stride = gfxInfo.attribsPerVertex - V_POS_COUNT;

//     // const newPos = Rotate4x4(dim, angle)
//     const newPos = RotateZ(dim, angle)

//     vb_data[index++] = newPos[0];
//     vb_data[index++] = newPos[1];
//     index += stride;
//     vb_data[index++] = newPos[2];
//     vb_data[index++] = newPos[3];
//     index += stride;
//     vb_data[index++] = newPos[4];
//     vb_data[index++] = newPos[5];
//     index += stride;
//     vb_data[index++] = newPos[6];
//     vb_data[index++] = newPos[7];

//     Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
// }



// /*****************************************************************************************************************/
// // Geometry3D

// export function GlRotateY3D2(mesh, angle) {

//     const gfxInfo = mesh.gfx;
//     const dim = mesh.geom.dim;

//     const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
//     const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES

//     let index = gfxInfo.vb.start + offset;
//     let stride = gfxInfo.attribsPerVertex;
//     let vertices = num_faces * gfxInfo.vertsPerRect;

//     const c = Math.cos(angle);
//     const s = Math.sin(angle);
//     const r = [
//         c, -s,
//         s, c,
//     ];

//     const vPosF = [
//         -1 * dim[0], 1 * dim[1], 1 * dim[2],
//         -1 * dim[0], -1 * dim[1], 1 * dim[2],
//         1 * dim[0], 1 * dim[1], 1 * dim[2],
//         1 * dim[0], -1 * dim[1], 1 * dim[2],
//     ];
//     const vPosBK = [
//         -1 * dim[0], 1 * dim[1], -1 * dim[2],
//         -1 * dim[0], -1 * dim[1], -1 * dim[2],
//         1 * dim[0], 1 * dim[1], -1 * dim[2],
//         1 * dim[0], -1 * dim[1], -1 * dim[2],
//     ];
//     const vPosR = [
//         1 * dim[0], -1 * dim[1], 1 * dim[2],
//         1 * dim[0], -1 * dim[1], -1 * dim[2],
//         1 * dim[0], 1 * dim[1], 1 * dim[2],
//         1 * dim[0], 1 * dim[1], -1 * dim[2],
//     ];
//     const vPosL = [
//         -1 * dim[0], -1 * dim[1], 1 * dim[2],
//         -1 * dim[0], -1 * dim[1], -1 * dim[2],
//         -1 * dim[0], 1 * dim[1], 1 * dim[2],
//         -1 * dim[0], 1 * dim[1], -1 * dim[2],
//     ];
//     const vPosT = [
//         -1 * dim[0], 1 * dim[1], 1 * dim[2],
//         -1 * dim[0], 1 * dim[1], -1 * dim[2],
//         1 * dim[0], 1 * dim[1], 1 * dim[2],
//         1 * dim[0], 1 * dim[1], -1 * dim[2],
//     ];
//     const vPosBot = [
//         -1 * dim[0], -1 * dim[1], 1 * dim[2],
//         -1 * dim[0], -1 * dim[1], -1 * dim[2],
//         1 * dim[0], -1 * dim[1], 1 * dim[2],
//         1 * dim[0], -1 * dim[1], -1 * dim[2],
//     ];

//     let xf = 0,
//         yf = 1,
//         zf = 2;


//     vertices = 4;
//     while (vertices) {
//         vb[index + 0] = vPosF[xf] * r[0] + vPosF[zf] * r[2];
//         vb[index + 2] = vPosF[xf] * r[1] + vPosF[zf] * r[3];
//         xf += 3; yf += 3; zf += 3;
//         index += stride;
//         vertices--;
//     }
//     vertices = 4;
//     xf = 0, yf = 1, zf = 2;
//     while (vertices) {
//         vb[index + 0] = vPosL[xf] * r[0] + vPosL[zf] * r[2];
//         vb[index + 2] = vPosL[xf] * r[1] + vPosL[zf] * r[3];
//         xf += 3; yf += 3; zf += 3;
//         index += stride;
//         vertices--;
//     }
//     vertices = 4;
//     xf = 0, yf = 1, zf = 2;
//     while (vertices) {
//         vb[index + 0] = vPosBK[xf] * r[0] + vPosBK[zf] * r[2];
//         vb[index + 2] = vPosBK[xf] * r[1] + vPosBK[zf] * r[3];
//         xf += 3; yf += 3; zf += 3;
//         index += stride;
//         vertices--;
//     }
//     xf = 0, yf = 1, zf = 2;
//     vertices = 4;
//     while (vertices) {
//         vb[index + 0] = vPosR[xf] * r[0] + vPosR[zf] * r[2];
//         vb[index + 2] = vPosR[xf] * r[1] + vPosR[zf] * r[3];
//         xf += 3; yf += 3; zf += 3;
//         index += stride;
//         vertices--;
//     }
//     vertices = 4;
//     xf = 0, yf = 1, zf = 2;
//     while (vertices) {
//         vb[index + 0] = vPosT[xf] * r[0] + vPosT[zf] * r[2];
//         vb[index + 2] = vPosT[xf] * r[1] + vPosT[zf] * r[3];
//         xf += 3; yf += 3; zf += 3;
//         index += stride;
//         vertices--;
//     }
//     vertices = 4;
//     xf = 0, yf = 1, zf = 2;
//     while (vertices) {
//         vb[index + 0] = vPosBot[xf] * r[0] + vPosBot[zf] * r[2];
//         vb[index + 2] = vPosBot[xf] * r[1] + vPosBot[zf] * r[3];
//         xf += 3; yf += 3; zf += 3;
//         index += stride;
//         vertices--;
//     }

//     Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
// }



// /** */
// export function GlRotateX3D(mesh, angle) {

//     const gfxInfo = mesh.gfx;
//     const dim = mesh.geom.dim;
//     const faces = mesh.geom.faces;
//     let fLen = faces.length;

//     const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
//     const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES

//     let index = gfxInfo.vb.start + offset;
//     let stride = gfxInfo.attribsPerVertex;

//     const c = Math.cos(angle);
//     const s = Math.sin(angle);
//     const r = [c, -s, s, c,];


//     const y = 1, z = 2;
//     let ii = 0;

//     const r1 = r[0] * dim[y],
//         r2 = r[2] * dim[z],
//         r3 = r[1] * dim[y],
//         r4 = r[3] * dim[z];

//     for (let i = 0; i < fLen; i++) {
//         vb[index + y] = faces[ii + y] * r1 + faces[ii + z] * r2;
//         vb[index + z] = faces[ii + y] * r3 + faces[ii + z] * r4;
//         ii += 3;
//         index += stride;
//     }

//     Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
// }



// /** */
// export function GlRotateY3D(mesh, angle) {

//     const gfxInfo = mesh.gfx;
//     const dim = mesh.geom.dim;
//     const faces = mesh.geom.faces;
//     let fLen = faces.length;

//     const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
//     const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES

//     let index = gfxInfo.vb.start + offset;
//     let stride = gfxInfo.attribsPerVertex;

//     const c = Math.cos(angle);
//     const s = Math.sin(angle);
//     const r = [c, s, -s, c,];


//     const x = 0, z = 2;
//     let ii = 0;

//     const r1 = r[0] * dim[x],
//         r2 = r[2] * dim[z],
//         r3 = r[1] * dim[x],
//         r4 = r[3] * dim[z];

//     for (let i = 0; i < fLen; i += 3) {
//         vb[index + x] = faces[ii + x] * r1 + faces[ii + z] * r2;
//         vb[index + z] = faces[ii + x] * r3 + faces[ii + z] * r4;
//         // vb[index + x] = faces[xi+x] * r[0] * dim[x] + faces[zi+z] * r[2] * dim[z];
//         // vb[index + z] = faces[xi+x] * r[1] * dim[x] + faces[zi+z] * r[3] * dim[z];
//         ii += 3;
//         index += stride;
//     }

//     Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
// }



// /** */
// export function GlRotateZ3D(mesh, angle) {

//     const gfxInfo = mesh.gfx;
//     const dim = mesh.geom.dim;
//     const faces = mesh.geom.faces;
//     let fLen = faces.length;

//     const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
//     const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES

//     let index = gfxInfo.vb.start + offset;
//     let stride = gfxInfo.attribsPerVertex;
//     let vertices = num_faces * gfxInfo.vertsPerRect;

//     const c = Math.cos(angle);
//     const s = Math.sin(angle);
//     const r = [c, -s, s, c,];

//     const x = 0, y = 1;
//     let ii = 0;

//     const r1 = r[0] * dim[x],
//         r2 = r[2] * dim[y],
//         r3 = r[1] * dim[x],
//         r4 = r[3] * dim[y];

//     vertices = 4;
//     for (let i = 0; i < fLen; i++) {

//         vb[index + x] = faces[ii + x] * r1 + faces[ii + y] * r2;
//         vb[index + y] = faces[ii + x] * r3 + faces[ii + y] * r4;
//         ii += 3;
//         index += stride;
//     }

//     Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
// }



// /** // TODO: Store the new pos and dim to the mesh for collision detection */
// export function GlRotateXY3D(mesh, angle) {

//     const gfxInfo = mesh.gfx;
//     const dim = mesh.geom.dim;
//     const faces = mesh.geom.faces;
//     let fLen = faces.length;

//     const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
//     const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES

//     let index = gfxInfo.vb.start + offset;
//     let stride = gfxInfo.attribsPerVertex;
//     let vertices = num_faces * gfxInfo.vertsPerRect;

//     const cos = Math.cos(angle);
//     const sin = Math.sin(angle);

//     ROT3D.SetRX(cos, sin)
//     ROT3D.SetRY(cos, sin)
//     ROT3D.SetRZ(cos, sin)

//     const mat1 = Matrix3x3_3x3Mult(ROT3D.RZ, ROT3D.RY);
//     const mat2 = mat1;

//     const x = 0, y = 1, z = 2;
//     let ii = 0;

//     vertices = 4;
//     for (let i = 0; i < fLen; i++) {
//         vb[index + x] = faces[ii + x] * mat2[0] * dim[x] + faces[ii + y] * mat2[3] * dim[y] + faces[ii + z] * mat2[6] * dim[z];
//         vb[index + y] = faces[ii + x] * mat2[1] * dim[x] + faces[ii + y] * mat2[4] * dim[y] + faces[ii + z] * mat2[7] * dim[z];
//         vb[index + z] = faces[ii + x] * mat2[2] * dim[x] + faces[ii + y] * mat2[5] * dim[y] + faces[ii + z] * mat2[8] * dim[z];
//         ii += 3;
//         index += stride;
//     }

//     Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
// }

