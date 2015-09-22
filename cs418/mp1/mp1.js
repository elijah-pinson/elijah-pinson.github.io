
var gl;
var canvas;
var shaderProgram;
var vertexPositionBuffer;


// Create a place to store vertex colors
var vertexColorBuffer;

var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var rotAngle = 0;
var lastTime = 0;
var sin = 0;

// checkbox
var cbox = document.getElementById("wireframeCheckbox");

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}


function degToRad(degrees) {
        return degrees * Math.PI / 180;
}


function createGLContext(canvas) {
  var names = ["webgl", "experimental-webgl"];
  var context = null;
  for (var i=0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}

function loadShaderFromDOM(id) {
  var shaderScript = document.getElementById(id);

  // If we don't find an element with the specified id
  // we do an early exit
  if (!shaderScript) {
    return null;
  }

  // Loop through the children for the found DOM element and
  // build up the shader source code as a string
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
      shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }

  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

function setupShaders() {
  vertexShader = loadShaderFromDOM("shader-vs");
  fragmentShader = loadShaderFromDOM("shader-fs");

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram);
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

}

function setupBuffers() {

  // making triangle strip vertices
  // will have two degenerate triangles in order to make the I in one triangle strip
  // var triangleVertices = [
  //
  //         -0.3,  -0.2,  0.0,
  //         -0.3,  -0.4,  0.0,
  //         -0.1, -0.2,  0.0,
  //         -0.1, -0.4,  0.0,
  //         0.1, -0.2,  0.0,
  //         0.1, -0.4,  0.0,
  //         0.3,  -0.2,  0.0,
  //         0.3,  -0.4,  0.0,
  //
  //         // degenerate
  //         0.3, -0.2,  0.0,
  //         -0.1, -0.2,  0.0,
  //
  //         -0.1, -0.2,  0.0,
  //         -0.1, 0.2,  0.0,
  //         0.1, -0.2,  0.0,
  //         0.1, 0.2,  0.0,
  //
  //         // degenerate
  //         -0.1, 0.2,  0.0,
  //         -0.3, 0.2,  0.0,
  //
  //         -0.3, 0.4,  0.0,
  //         -0.1, 0.2,  0.0,
  //         -0.1, 0.4, 0.0,
  //         0.1, 0.2, 0.0,
  //         0.1, 0.4, 0.0,
  //         0.3, 0.2, 0.0,
  //         0.3, 0.4, 0.0
  // ];

  var triangleVertices_bot = [
          -0.3,  -0.2,  0.0,
          -0.3,  -0.4,  0.0,
          -0.1, -0.2,  0.0,
          -0.1, -0.4,  0.0,
          0.1, -0.2,  0.0,
          0.1,  -0.4,  0.0,
          0.3, -0.2,  0.0,
          0.3, -0.4,  0.0,
  ];

  var triangleVertices_mid = [
          -0.1,  0.2,  0.0,
          -0.1,  -0.2,  0.0,
          0.1, 0.2,  0.0,
          0.1, -0.2,  0.0,
  ];

  var triangleVertices_top = [
          -0.3,  0.4,  0.0,
          -0.3,  0.2,  0.0,
          -0.1, 0.4,  0.0,
          -0.1, 0.2,  0.0,
          0.1,  0.4,  0.0,
          0.1, 0.2,  0.0,
          0.3, 0.4,  0.0,
          0.3, 0.2,  0.0,
  ];

  // following two sets of 4 vertices are for LINE_LOOP to make sure wireframe version shows whole triangle
  var topbox_wireframe = [
    -0.3,  0.4,  0.0,
    -0.3, 0.2,  0.0,
    0.3, 0.2,  0.0,
    0.3, 0.4,  0.0,
  ];

  var botbox_wireframe = [
    -0.3, -0.2,  0.0,
    -0.3,  -0.4,  0.0,
    0.3, -0.4,  0.0,
    0.3, -0.2,  0.0,
  ];

  vertexPositionBuffer_bot = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer_bot);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices_top), gl.STATIC_DRAW);
  vertexPositionBuffer_bot.itemSize = 3;
  vertexPositionBuffer_bot.numberOfItems = 8;


  vertexPositionBuffer_mid = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer_mid);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices_mid), gl.STATIC_DRAW);
  vertexPositionBuffer_mid.itemSize = 3;
  vertexPositionBuffer_mid.numberOfItems = 4;


    vertexPositionBuffer_top = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer_top);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices_bot), gl.STATIC_DRAW);
    vertexPositionBuffer_top.itemSize = 3;
    vertexPositionBuffer_top.numberOfItems = 8;


    // buffers for the extra wireframe stuff
    wirebuffer_top = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, wirebuffer_top);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(topbox_wireframe), gl.STATIC_DRAW);
    wirebuffer_top.itemSize = 3;
    wirebuffer_top.numberOfItems = 4;

    wirebuffer_bot = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, wirebuffer_bot);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(botbox_wireframe), gl.STATIC_DRAW);
    wirebuffer_bot.itemSize = 3;
    wirebuffer_bot.numberOfItems = 4;





  vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  var colors_top = [
        1.0, 0.0, 1.0, 1.0,
        1.0, 0.5, 0.0, 1.0,
        1.0, 0.0, 1.0, 1.0,
        1.0, 0.5, 0.0, 1.0,
        1.0, 0.0, 1.0, 1.0,
        1.0, 0.5, 0.0, 1.0,
        1.0, 0.0, 1.0, 1.0,
        1.0, 0.5, 0.0, 1.0,
        1.0, 0.0, 1.0, 1.0
    ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors_top), gl.STATIC_DRAW);
  vertexColorBuffer.itemSize = 4;
  vertexColorBuffer.numItems = 8;

  vertexColorBuffer_mid = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer_mid);
  var colors_mid = [
        1.0, 0.0, 1.0, 1.0,
        1.0, 0.5, 0.0, 1.0,
        1.0, 0.0, 1.0, 1.0,
        1.0, 0.5, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors_mid), gl.STATIC_DRAW);
  vertexColorBuffer_mid.itemSize = 4;
  vertexColorBuffer_mid.numItems = 4;
}

function draw() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  mat4.identity(mvMatrix);
  // mat4.rotateX(mvMatrix, mvMatrix, degToRad(rotAngle));
  // mat4.rotateY(mvMatrix, mvMatrix, degToRad(rotAngle));
  mat4.rotateZ(mvMatrix, mvMatrix, degToRad(rotAngle));
  mat4.translate(mvMatrix, mvMatrix, [sin/2, 0, sin/2]);
  mat4.scale(mvMatrix, mvMatrix, [sin + 1, sin + 1, sin + 1]);
  // gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  // gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
  //                        vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  // gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  // gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
  //                           vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  setMatrixUniforms();

  if(wireframeCheckbox.checked){
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer_bot);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                           vertexPositionBuffer_bot.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
                              vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_STRIP, 0, vertexPositionBuffer_bot.numberOfItems);


    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer_mid);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                           vertexPositionBuffer_mid.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer_mid);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
                              vertexColorBuffer_mid.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_STRIP, 0, vertexPositionBuffer_mid.numberOfItems);


    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer_top);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                           vertexPositionBuffer_top.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
                              vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_STRIP, 0, vertexPositionBuffer_top.numberOfItems);

    //draw top box wireframe
    gl.bindBuffer(gl.ARRAY_BUFFER, wirebuffer_top);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                           wirebuffer_top.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer_mid);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
                              vertexColorBuffer_mid.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_LOOP, 0, wirebuffer_top.numberOfItems);

    //draw bottom box wireframe
    gl.bindBuffer(gl.ARRAY_BUFFER, wirebuffer_bot);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                           wirebuffer_bot.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer_mid);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
                              vertexColorBuffer_mid.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_LOOP, 0, wirebuffer_bot.numberOfItems);
  }
  else{

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer_bot);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                           vertexPositionBuffer_bot.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
                              vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPositionBuffer_bot.numberOfItems);


    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer_mid);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                           vertexPositionBuffer_mid.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer_mid);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
                              vertexColorBuffer_mid.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPositionBuffer_mid.numberOfItems);


    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer_top);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                           vertexPositionBuffer_top.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
                              vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPositionBuffer_top.numberOfItems);

  }

}

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        rotAngle= (rotAngle+1.0) % 360;
        sin = Math.sin(degToRad(rotAngle));
    }
    lastTime = timeNow;
}

function startup() {
  canvas = document.getElementById("myGLCanvas");
  gl = createGLContext(canvas);
  setupShaders();
  setupBuffers();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  tick();
}

function tick() {
    requestAnimFrame(tick);
    draw();
    animate();
}
