requirejs.config({
	paths: {
  	"glm": "../bower_components/gl-matrix/dist/gl-matrix",
  	"domReady": "../bower_components/domready/ready.min",
  	"extensions": "extensions",
  	"vector": "mesh/vector",
  	"vertex": "mesh/vertex",
  	"edge": "mesh/edge",
  	"face": "mesh/face",
  	"mesh": "mesh/mesh",
  	"models": "models",
  	"helper": "glhelper"
    }
});

// globals objects
var canvas;
var gl;
//var GUI = require('scripts/libs/dat.gui.min.js')

// Model data buffers
var modelVecBuffer;
var modelVecColorBuffer;
var modelVecIndexBuffer;
var modelVecNormalBuffer
var modelWireBuffer;
var modelWireColorBuffer;

// Model data counts
var numElements;
var numVectors;

// Shader stuff
var shaderProgram;
var vertexPositionAttribute;
var vertexColorAttribute;
var vertexNormalAttribute

// keeping track of things
var modelRotationMatrix; 
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var projection = 0.0;
var projectionMatrix;

// Model matrices
var mvMatrix;
var perspectiveMatrix;

// Helper function for DAT.GUI
var Controller = function() {
  this.x = false
  this.y = false
  this.z = false
  this.numSubdivides = 0;
  this.mesh = 1;
  this.posUpdated = false;
  this.wireframe = true;
  this.subScheme = 0;
}

var control;
var reloadBuffers = false;


require(['domReady', 'extensions', 'models', 'mesh', 'helper', 'glm'], 
	function(domReady, Extension, Models, Mesh, Helper, glm) {

	domReady(function() {
      
      // Get canvas
      canvas = document.getElementById("glcanvas");

      // Resize canvas
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      window.addEventListener('resize', resizeCanvas, false);

      // Add mouse listeners
      canvas.onmousedown = handleMouseDown;
      document.onmouseup = handleMouseUp;
      document.onmousemove = handleMouseMove;
      canvas.addEventListener('mousewheel', handleMouseScroll, false);
      canvas.addEventListener('DOMMouseScroll', handleMouseScroll, false);

      document.onscroll = function() {
        console.log("Scrolling");
      }

      function resizeCanvas() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      // Init DAT.GUI Controller.
      control = new Controller();
      var gui = new dat.GUI();
      // Add properties to DAT.GUI
      gui.add(control, 'x').name("Rotate X");
      gui.add(control, 'y').name("Rotate Y");
      gui.add(control, 'z').name("Rotate Z");
      gui.add(control, "wireframe").name("Wireframe");
      var subTracker = gui.add(control, 'numSubdivides', 0, 6).name("No. Subdivides").listen();
      var meshTracker = gui.add(control, 'mesh', {Cube: 1, Cone: 2, Torus: 3, 
        CubeTwo:4, Monkey: 5, Face: 6, Sphere: 7}).name("Mesh Type");
      var subScheme = gui.add(control, 'subScheme', { 'Catmull-Clark': 0, 'Doo-Sabin':1}).name("Subd Scheme");
      // Listeners to detect DAT.GUI changes
      subScheme.onFinishChange(function(value) {
        control.numSubdivides = 0;
        reloadBuffers = true;
      })
      
      subTracker.onFinishChange(function(value) {
        reloadBuffers = true;
      });
      meshTracker.onFinishChange(function(value) {
        control.numSubdivides = 0;
        reloadBuffers = true;
        control.posUpdated = false;
      });

      //initWebGL(canvas);      // Initialize the GL context
      gl = Helper.initCanvas(canvas);

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
        initBuffers();

        // Set up to draw the scene periodically.
        setInterval(drawScene, 15);
      }

    // Init the shaders
    function initShaders() {
      // Get the shaders
      var fragmentShader = Helper.loadShaderFromDOM(gl, "shader-fs");
      var vertexShader = Helper.loadShaderFromDOM(gl, "shader-vs");

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
    function initBuffers() {

      var meshCube;
      if (control.mesh == 1){
        meshCube = Models.cube();
      } else if (control.mesh == 2) {
        meshCube = Models.cone();
      } else if (control.mesh == 3) {
        meshCube = Models.torus();
      } else if(control.mesh == 4) {
        meshCube = Models.cubeTwo();
      } else if (control.mesh == 5) {
        meshCube = Models.monkey();
      } else if (control.mesh == 6) {
        meshCube = Models.face();
      } else if (control.mesh == 7) {
        meshCube = Models.sphere();
      }

      for (var i = 0; i < control.numSubdivides; i++) {
        if (control.subScheme == 0) {
          console.log("Scheme is catmull");
          meshCube = meshCube.catmullSubdivide();
        } else if (control.subScheme == 1) {
          console.log("scheme is doosabin");
          meshCube = meshCube.doosabinSubdivide();
        }
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

      var colors = [
        [1.0,  1.0,  1.0,  1.0],    // Front face: white
        [1.0,  0.0,  0.0,  1.0],    // Back face: red
        [0.0,  1.0,  0.0,  1.0],    // Top face: green
        [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
        [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
        [1.0,  0.0,  1.0,  1.0]     // Left face: purple
      ];
      var modelColors = [];
      // var i = 0;
      // for (var c = 0; c < meshCube.vertices.length; c++) {
      //   modelColors.append(colors[i]);
      //   i++;
      //   if (i === 6) {
      //     i = 0;
      //   }
      // }

      // for every face
      var a = 0;
      for (var i = 0; i < meshCube.faces.length; i++) {
        // For every vertex of the face
          modelColors.append(colors[a]);
          modelColors.append(colors[a]);
          modelColors.append(colors[a]);
          modelColors.append(colors[a]);       
          a++;
          if (a === 6) {
            a = 0;
          }
        
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
    
      // Lighting buffer
      var vertexNormals = []
      for (var i = 0; i < meshCube.vertices.length; i++) {
        vertexNormals.append(meshCube.vertices[i].vec.normalise());
      }
      // Bind lighting normals buffer
      modelVecNormalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, modelVecNormalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
    }

    var cubeRotation = 0;
    var lastCubeUpdateTime = 0;
    var firstRun = false;
    modelRotationMatrix = glm.mat4.create();
    glm.mat4.identity(modelRotationMatrix);
    projectionMatrix = glm.mat4.create()
    glm.mat4.identity(projectionMatrix);
    // Drawing the scene
    function drawScene() {

      if (reloadBuffers) {
        initBuffers();
        reloadBuffers = false;
      }

      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

      perspectiveMatrix = glm.mat4.create();
      glm.mat4.perspective(perspectiveMatrix, Math.degToRad(45.0), canvas.width/canvas.height, 0.1, 100.0);

      gl.viewport(0, 0, canvas.width, canvas.height)

      if (!firstRun) {
        mvMatrix = glm.mat4.create();
        glm.mat4.translate(mvMatrix, mvMatrix, [-0.0, 0.0, -6.0]);
        glm.mat4.rotate(mvMatrix, mvMatrix, Math.degToRad(45), [1, 1, 1]);

        firstRun = true
      }
      if (!control.posUpdated){
        if (control.mesh == 4) {
          glm.mat4.translate(mvMatrix, mvMatrix, [0.0, 1.0, -6.0]);
        }
        control.posUpdated = true;
      }

      if (control.x) {
        glm.mat4.rotate(mvMatrix, mvMatrix, Math.degToRad(3), [1, 0, 0]);
      }
      if (control.y) {
        glm.mat4.rotate(mvMatrix, mvMatrix, Math.degToRad(3), [0, 1, 0]);
      }
      if (control.z) {
        glm.mat4.rotate(mvMatrix, mvMatrix, Math.degToRad(3), [0, 0, 1]);
      }

      //the projection matrix to webgl
      //glm.mat4.ortho(projectionMatrix, -projection, projection, -projection, projection, 0.0, 0.0);

      // Rotate the view
      glm.mat4.multiply(mvMatrix, mvMatrix, modelRotationMatrix);

      // Normal matrix
      var normalMatrix = glm.mat4.create();
      glm.mat4.invert(normalMatrix, mvMatrix);
      glm.mat4.transpose(normalMatrix, normalMatrix);
      var nUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix")
      gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix));


      setMatrixUniforms();
      
      // Bind vertex normals to shader attribute
      gl.bindBuffer(gl.ARRAY_BUFFER, modelVecNormalBuffer);
      gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vertexNormalAttribute)

      /* Drawing the shape */
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

      /* Drawing the wireframe */
      if (control.wireframe) {
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

    }

    function setMatrixUniforms() {
      // set the perspective matrix
      var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
      gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix));

      // set the model view matrix
      var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
      gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix));

      // Set the projection matrix
      // var projUniform = gl.getUniformLocation(shaderProgram, "uProjMatrix");
      //  gl.uniformMatrix4fv(projUniform, false, new Float32Array(projectionMatrix));
    }

    // Set the mouse down when pressed and set the x,y coords
    function handleMouseDown(event) {
      mouseDown = true;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      console.log("down")
    }

    // Handle mouse up
    function handleMouseUp(event) {
      mouseDown = false
      glm.mat4.identity(modelRotationMatrix)
    }

    // Moving the model when mouse moves
    function handleMouseMove(event) {
      // Check left button pressed
      if (!mouseDown) {
        return;
      }
      var rot = 0;

      rot = (Math.PI/5000) * (event.clientX - lastMouseX);
      glm.mat4.rotateY(modelRotationMatrix, modelRotationMatrix, rot);

      rot = (Math.PI/5000) * (event.clientY - lastMouseY);
      glm.mat4.rotateX(modelRotationMatrix, modelRotationMatrix, rot);

      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
    }

    function handleMouseScroll(event) {
      // Stop keeping track
      event.preventDefault();
      // Get value
      var delta = event.detail? event.detail/(-3) : event.wheelDelta/(120); //Different web browsers
      // Calculate projection value
      projection -= (0.15*delta);
      // Set projection limit
      if (projection < 0.03) {
        projection = 0.03
      }
    }










  });
});