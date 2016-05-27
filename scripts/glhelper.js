/**
 * glhelper.js
 * SubdivisionJS
 *
 * Created by shazib hussain on 07/06/2015
 * copyright (c) 2015 Shazib Hussain
 *
 * This file contains helper method for WebGL
 * 
 */


define("helper", [], function() {

 	// Class constructor
 	function Helper() {
 		this.base = "shaders/"
 	}

	Helper.initCanvas = function(canvas) {
	  var gl = null;

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
	  return gl;
	}

	// This function loads a shader from the html and compiles it
	// the shader still needs to be bound
	Helper.loadShaderFromDOM = function(gl, id) {
		var shaderScript, theSource, currentChild, shader;

		// Find the element with the specified Id and read source
		shaderScript = document.getElementById(id);

		if (!shaderScript) {
			return null
		}

		theSource = "";
		currentChild = shaderScript.firstChild;

		while(currentChild) {
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

	} // End load shader


	return Helper;

});

