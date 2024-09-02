"use strict";
const version                    = "#version 300 es";
const precision_medium           = "precision mediump float;";
const precision_high             = "precision highp float;";
const u_orthoProj_in             = 'uniform mat4 u_projection;';

export const vertex_shader_chunks = {
   version                 : version,
   precision_medium        : precision_medium,
   precision_high          : precision_high,
   u_orthoProj_in          : u_orthoProj_in,
};


// Fragment Shader
const out_frag_color     = 'out vec4 frag_color;';
const frag_u_sampler0    = 'uniform sampler2D u_sampler0;';

export const fragment_shader_chunks = {
   version: version,
   precision_medium  : precision_medium ,
   precision_high    : precision_high   ,
   out_frag_color    : out_frag_color   ,
   frag_u_sampler0   : frag_u_sampler0  ,
};
