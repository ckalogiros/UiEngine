/* HTML script - SHADERS

   <canvas id="canvas"></canvas>
   <!-- vertex shader -->
   <script  id="vertex-shader-3d" type="x-shader/x-vertex">
   attribute vec4 a_position;
   attribute vec4 color;
   attribute vec2 wpos;

   varying vec4 v_color;

   void main() {
   // Multiply the position by the matrix.
   // gl_Position = a_position;
   gl_Position = vec4(a_position.x + wpos.x, a_position.y + wpos.y, 0., 1.);

   // Pass the vertex color to the fragment shader.
   v_color = color;
   }
   </script>
   <!-- fragment shader -->
   <script  id="fragment-shader-3d" type="x-shader/x-fragment">
   precision mediump float;

   // Passed in from the vertex shader.
   varying vec4 v_color;

   void main() {
   gl_FragColor = v_color;
   }
   </script>
   <script src="https://webglfundamentals.org/webgl/resources/webgl-utils.js"></script>
   <script src="https://webglfundamentals.org/webgl/resources/m4.js"></script>

*/

'use strict';

function main() {

  const canvas = document.querySelector('#canvas');
  const gl = canvas.getContext('webgl');
  if (!gl) {
    return;
  }

  const ext = gl.getExtension('ANGLE_instanced_arrays');
  if (!ext) {
    return alert('need ANGLE_instanced_arrays');  // eslint-disable-line
  }

  const program = webglUtils.createProgramFromScripts(
      gl, ['vertex-shader-3d', 'fragment-shader-3d']);

  const FLOAT = 4;


  /******************************************************************************/
  const positionLoc = gl.getAttribLocation(program, 'a_position');
  const colorLoc = gl.getAttribLocation(program, 'color');
  const wposLoc = gl.getAttribLocation(program, 'wpos');


  /******************************************************************************/
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -0.3,  0.3,
      -0.3, -0.3,
       0.3, -0.3,
       0.3, -0.3,
      -0.3,  0.3,
       0.3,  0.3,
    ]), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
  const numVertices = 6;
  
  const colWpos = new Float32Array([
    .4, 1, .2, 1,   // colors
    .5, 0,          // positions
    .6, .1, .9, 1,  // colors
    -.5, 0,         // positions
  ]);

  const colWposBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colWposBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colWpos, gl.STATIC_DRAW);


  /******************************************************************************/
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, colWposBuffer);
  // Enable the first attribute of buffer 2
  gl.enableVertexAttribArray(colorLoc);
  gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 6*FLOAT, 0);
  ext.vertexAttribDivisorANGLE(colorLoc, 1);
  // Enable the second attribute of buffer 2
  gl.enableVertexAttribArray(wposLoc);
  gl.vertexAttribPointer(wposLoc, 2, gl.FLOAT, false, 6*FLOAT, 4*FLOAT);
  ext.vertexAttribDivisorANGLE(wposLoc, 1);


  function render(time) {

    gl.clearColor(0.18, 0.18, 0.18, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    time *= 0.001; // seconds

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.useProgram(program);

    ext.drawArraysInstancedANGLE( gl.TRIANGLES, 0, numVertices, 2);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
