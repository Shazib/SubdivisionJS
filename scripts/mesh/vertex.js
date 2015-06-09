/**
 * vertex.js
 * SubdivisionJS
 *
 * Created by shazib hussain on 07/06/2015
 * copyright (c) 2015 Shazib Hussain
 *
 * This class represents a vertex in a 3D mesh.
 * The vertex stores vector location and adjacent edge/face lists 
 */

// Load dependancies
define ("vertex",["vector"], function(Vector) {
	"use strict";

	// Class constructor 
	function Vertex(vec) {
		// Confirm new keyword was used
		if (!(this instanceof Vertex)) {
			throw new TypeError("Vertex constructor cannoot be called as a function");
		}
		// Set coord of vertex
		this.vec = vec;
		// Edge and face lists
		this.edgeIndices = [];
		this.faceIndices = [];
	}

	// Generic public constructor
	Vertex.create = function(vec) {
		this.vec = vec;

		this.edgeIndices = [];
		this.faceIndices = [];

		return this;
	}

	// Static method
	Vertex.manyFromVectors = function(vectors) {
		var returnValues = [];

		for (var i = 0; i < vectors.length; i++) {
			var vec = vectors[i];
			var vertex = new Vertex(vec);
			returnValues.push(vertex);
		}

		return returnValues;
	}


	// // Prototype
	// Vertex.prototype = {
	// 	// Repoint the constructor for prototype definition
	// 	constructor: Vertex

	// } // End prototype

	// Return reference to the constructor 
	return Vertex;

}); // End define