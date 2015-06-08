requirejs.config({
	paths: {
  	"glm": "../bower_components/gl-matrix/dist/gl-matrix",
  	"DAT": "../bower_components/dat-gui/build/dat.gui",
  	"domReady": "../bower_components/domready/ready.min",
  	"extensions": "extensions",
  	"vector": "vector",
  	"vertex": "vertex",
  	"edge": "edge",
  	"face": "face",
  	"mesh": "mesh",
  	"models": "models",
  	"helper": "glhelper"
    }
});

// globals objects
var canvas;
var gl;

// Model data buffers
var modelVecBuffer;
var modelVecColorBuffer;
var modelVecIndexBuffer;
var modelWireBuffer;
var modelWireColorBuffer;
// Model data counts
var numElements;
var numVectors;
// Shader stuff
var shaderProgram;
var vertexPositionAttribute;
var vertexColorAttribute;
// keeping track of things
var subCount = 0;
var modelRotationMatrix; 
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

var mvMatrix;
var perspectiveMatrix;

require(['domReady', 'extensions', 'models', 'mesh', 'helper', 'glm'], 
	function(domReady, Extension, Models, Mesh, Helper, glm) {

	domReady(function() {


  canvas = document.getElementById("glcanvas");

  initWebGL(canvas);      // Initialize the GL context

  // Only continue if WebGL is available and working
  if (gl) {
    gl.clearColor(0.31, 0.58, 0.8, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Initialize the shaders; this is where all the lighting for the
    // vertices and so forth is established.
    initShaders();

    // Here's where we call the routine that builds all the objects
    // we'll be drawing.
    initBuffers(subCount);

    // Set up to draw the scene periodically.
    setInterval(drawScene, 15);
  }


// Init WebGL and the Canvas
function initWebGL(canvas) {
  gl = null;

  try {
    // Try to grab the standard context. Fallback to experimental
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  }
  catch(e) {}

  // Give up if no context
  if (!gl) {
    alert("Unable to initialise WebGL. Your browser may not support it");
    gl = null;
  }
}

// Get shaders from DOM
function getShader(gl, id) {
  var shaderScript, theSource, currentChild, shader;

  // Find the element with the specified ID and read source
  shaderScript = document.getElementById(id);

  if (!shaderScript) {
    return null;
  }

  theSource = "";
  currentChild = shaderScript.firstChild;

  while (currentChild) {
    if (currentChild.nodeType == currentChild.TEXT_NODE) {
      theSource += currentChild.textContent;
    }

    currentChild = currentChild.nextSibling;
  }

  // Create the shader by checking its type
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    // Unknown shader type
    return null;
  }

  // Pass the source to the shader and compile it
  gl.shaderSource(shader, theSource);

  // Compile the shader program
  gl.compileShader(shader);

  // Check compilation
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occured compiling shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

// Init the shaders
function initShaders() {
  // Get the shaders
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");

  // var fragmentShader = Helper.loadShaderFromDOM(gl, "shader-fs");
  // var vertexShader = Helper.loadShaderFromDOM(gl, "shader-vs");

  // Create the shader program
  shaderProgram = gl.createProgram();
  // Attach the shaders to the program
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  // Link the program
  gl.linkProgram(shaderProgram);
  // Check for failure
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialise the shader program");
  }
  // Tell Gl to use this program
  gl.useProgram(shaderProgram);

  // Enable shader attributes
  vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);

  vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(vertexColorAttribute);
}

// Creating the buffers to contain the vertices
function initBuffers(count) {

  var meshCube = Models.cube();

  for (var i = 0; i < count; i++) {
    meshCube = meshCube.catmullSubdivide();
  }

  // vertices of the cube
  var vertices = [];
  vertices = meshCube.vectorArray();

  // get the index array
  var vectorIndex = [];
  vectorIndex = meshCube.elementArray();

  // number of indexes
  numElements = vectorIndex.length;

  // Wireframe edges
  var wireframeVectors = [];
  wireframeVectors = meshCube.wireframeVertices();

  // Number of vertices in wireframe
  numVectors = wireframeVectors.length/3;

  // Black 
  var blackColor = [0.0, 0.0, 0.0, 1.0];
  // Object color
  var modelColor = [0.4,  0.8, 0.59, 1.0];

  var wireframeColors = [];
  for (var c = 0; c < numVectors; c++) {
    wireframeColors.append(blackColor);
  }
  var modelColors = [];
  for (var c = 0; c < meshCube.vertices.length; c++) {
    modelColors.append(modelColor);
  }

  // cubeVecBuffer
  cubeVecBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVecBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Element Array
  cubeVecIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVecIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vectorIndex), gl.STATIC_DRAW);

  // Model colour buffer
  cubeVecColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVecColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelColors), gl.STATIC_DRAW);

  // wireframe buffer
  cubeWireBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeWireBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wireframeVectors), gl.STATIC_DRAW);

  // Wireframe colors buffer
  cubeWireColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeWireColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wireframeColors), gl.STATIC_DRAW);


  // console.log(numElements);
  // console.log(meshCube.vertices.length);
  // console.log(numVectors);
  // console.log(meshCube.vectorArray());
}


var cubeRotation = 0;
var lastCubeUpdateTime = 0;
var firstRun = false;
// Drawing the scene
function drawScene() {


  document.getElementById("sub").onclick = function() {
    subCount++;
    initBuffers(subCount);
  }

  document.getElementById("back").onclick = function() {
    subCount--;
    if (subCount < 0) {
      subCount = 0
    }
    initBuffers(subCount);
  }

  // get HTML Stuff
  var rangeVal = document.getElementById("myRange").value;
  var x = document.getElementById("x").checked;
  var y = document.getElementById("y").checked;
  var z = document.getElementById("z").checked;

  var xVal, yVal, xVal = 0;
  if (x) {xVal = 1;} else {xVal = 0;}
  if (y) {yVal = 1;} else {yVal = 0;}
  if (z) {zVal = 1;} else {zVal = 0;}

  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

  perspectiveMatrix = glm.mat4.create();
  glm.mat4.perspective(perspectiveMatrix, Math.degToRad(45.0), canvas.width/canvas.height, 0.1, 100.0);

  //mvMatrix = Matrix.I(4); // Load up an identity matrix into the model view matrix

  // Perform a translation on the MV matrix
  // MV * Matrix.Translation(vector).exsure4x4
  if (!firstRun) {
    //console.log(perspectiveMatrix);
    mvMatrix = glm.mat4.create();
    glm.mat4.translate(mvMatrix, mvMatrix, [-0.0, -0.0, -6.0]);
    glm.mat4.rotate(mvMatrix, mvMatrix, Math.degToRad(45), [1, 1, 1]);

    firstRun = true

  }

  if (x || y || z) {
   // mvRotate(rangeVal, [xVal, yVal, zVal]);
    glm.mat4.rotate(mvMatrix, mvMatrix, Math.degToRad(rangeVal), [xVal, yVal, zVal]);

  }

  modelRotationMatrix = glm.mat4.create();

  setMatrixUniforms();

  // Bind vectors
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVecBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPositionAttribute)
  // Bind colors
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVecColorBuffer);
  gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexColorAttribute)
  // Bind element array
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVecIndexBuffer);
  // Draw
  gl.drawElements(gl.TRIANGLES, numElements, gl.UNSIGNED_SHORT, 0);

  // Bind edge vectors
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeWireBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPositionAttribute)
  // Bind colors
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeWireColorBuffer);
  gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexColorAttribute)
  // Draw lines
  gl.drawArrays(gl.LINES, 0, numVectors)

}

function setMatrixUniforms() {
  // set the perspective matrix
  var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix));

  // set the model view matrix
  var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix));
}



});



});