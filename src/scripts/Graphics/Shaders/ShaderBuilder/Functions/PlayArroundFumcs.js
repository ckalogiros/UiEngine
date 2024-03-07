"use strict";

/**
* Edge Detection Vertex Shader
*/
const playArround1_Call = '\
   color = SdfLine();\n\
';
const playArround1 = '\
\
// squared sigend distance to a line \n\
float sdLineSquared(in vec2 iPoint, in vec2 iLine0, in vec2 iLine1) {\n\
	vec2 diff = iPoint - iLine0;\n\
	vec2 dir = iLine1 - iLine0;\n\
	float t = dot(diff, dir) / length2(dir);\n\
	t = clamp(t, 0.0, 1.0);\n\
	vec2 oLinePoint = t * dir + iLine0;\n\
	return length2(iPoint - oLinePoint);\n\
}\n\
\n\
\n\
// --- SDF - TODO! --------------------------------------------------------------\n\
\n\
float sdf(vec2 p, vec2 pm)\n\
{\n\
    vec2 p0 = vec2(-0.3,-0.4);\n\
    vec2 p1 = vec2(0.4,0.3);\n\
    vec2 p3 = vec2(-0.6,0.5);\n\
    vec2 p4 = vec2(0.6,-0.6);\n\
    //float d1 = abs(sqrt(sdLineSquared(p,p1,pm))-0.04)-0.001;\n\
    //float d1 = sqrt(sdLineSquared(p,p1,pm));\n\
    float d1 = sdLineSquared(p,p1,pm);\n\
    float d2 = sqrt(sdLineSquared(p,pm,p0));\n\
    float d3 = sqrt(sdLineSquared(p,pm,p3));\n\
    float d4 = sqrt(sdLineSquared(p,pm,p4));\n\
    \n\
    //float d4s = stroke(d4,0.0,0.1,0.01);\n\
    \n\
    return smin(d1,d2,d3,d4,0.02);\n\
}\n\
\n\
float SdfLine(){\n\
   float d = sdf(p, pm);\n\
   float c = smoothstep(0.,.01,d);\n\
   return c;\n\
}\n\
\
';