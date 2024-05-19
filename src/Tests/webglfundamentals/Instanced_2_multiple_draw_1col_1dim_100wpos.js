
/* HTML-SHADERS
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
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  const canvas = document.querySelector('#canvas');
  const gl = canvas.getContext('webgl');
  if (!gl) {
    return;
  }

  const ext = gl.getExtension('ANGLE_instanced_arrays');
  if (!ext) {
    return alert('need ANGLE_instanced_arrays');  // eslint-disable-line
  }

  // setup GLSL programs
  // compiles shaders, links program
  const program = webglUtils.createProgramFromScripts(
      gl, ['vertex-shader-3d', 'fragment-shader-3d']);

  const FLOAT = 4;


  /****************************************************************************/
  const positionLoc = gl.getAttribLocation(program, 'a_position');
  const colorLoc = gl.getAttribLocation(program, 'color');
  const wposLoc = gl.getAttribLocation(program, 'wpos');

  const col_count = 20;
  const pad = .005;
  // const size = (1/(gl.canvas.width/col_count))-pad;
  const size = .02-pad;

  const LEFT = -1 + size + pad;
  const TOP = 1 - (size + pad);
  const X = 0;
  const Y = 1;

  /**************************************/
  const wpos = new Float32Array(10*10*2);  
  let x = LEFT, y = TOP, cnt=0
  for(let i=0; i<40; i++){
    
    x=LEFT;
    for(let j=0; j<30; j++){
      wpos[cnt+X] = x;
      wpos[cnt+Y] = y;
      x += size*2+pad;
      cnt+=2

      // if()
    }
    y-=size*2+pad
  }
  // const wpos = new Float32Array([
  //   LEFT+.1, -.2,
  //   LEFT+.2, -.2,
  //   LEFT+.3, -.2,
  //   LEFT+.4, -.2,
  //   LEFT+.1, -.1,
  //   LEFT+.2, -.1,
  //   LEFT+.3, -.1,
  //   LEFT+.4, -.1,
  //   LEFT+.1, 0,
  //   LEFT+.2, 0,
  //   LEFT+.3, 0,
  //   LEFT+.4, 0,
  //   LEFT+.1, .1,
  //   LEFT+.2, .1,
  //   LEFT+.3, .1,
  //   LEFT+.4, .1,
  //   LEFT+.1, .2,
  //   LEFT+.2, .2,
  //   LEFT+.3, .2,
  //   LEFT+.4, .2,
  //   LEFT+.1, .3,
  //   LEFT+.2, .3,
  //   LEFT+.3, .3,
  //   LEFT+.4, .3,
  //   LEFT+.1, .4,
  //   LEFT+.2, .4,
  //   LEFT+.3, .4,
  //   LEFT+.4, .4,
  // ]);
    
  
  const wposBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, wposBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, wpos, gl.STATIC_DRAW);



  /**************************************/
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -size,  size,
      -size, -size,
       size, -size,
       size, -size,
      -size,  size,
       size,  size,
    ]), gl.STATIC_DRAW);

  const numVertices = 6;
  /**************************************/
  const colWpos = new Float32Array([
    .4, 1, .2, 1, // colors
    .6, .1, .9, 1, // colors
    .4, 1, .2, 1, // colors
    .6, .1, .9, 1, // colors
  ]);
  const colWposBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colWposBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colWpos, gl.STATIC_DRAW);

  const color_instance_count = wpos.length / 2;


  /***********************************************************************/
  // Set Attributes
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, colWposBuffer);
  gl.enableVertexAttribArray(colorLoc);
  gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 4*FLOAT, 0);
  ext.vertexAttribDivisorANGLE(colorLoc, color_instance_count);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, wposBuffer);
  gl.enableVertexAttribArray(wposLoc);
  gl.vertexAttribPointer(wposLoc, 2, gl.FLOAT, false, 2*FLOAT, 0);
  ext.vertexAttribDivisorANGLE(wposLoc, 1);


  function render(time) {

    gl.clearColor(0.18, 0.18, 0.18, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    time *= 0.001; // seconds

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.useProgram(program);

    ext.drawArraysInstancedANGLE( gl.TRIANGLES, 0, numVertices, color_instance_count);


    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
