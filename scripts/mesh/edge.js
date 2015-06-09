/**
 * edge.js
 * SubdivisionJS
 *
 * Created by shazib hussain on 07/06/2015
 * copyright (c) 2015 Shazib Hussain
 *
 * This class represents an edge in a 3D mesh.
 * The edge stores a list of indexes for faces and vertices.
 */

 // Load dependancies
 define ("edge", ["mesh", "vector", "vertex"], function(Mesh, Vector, Vertex) {
 	"use strict";

 	// Class constructor
 	function Edge(vertexIndices) {
 		// Confirm new keyword used
 		if (!(this instanceof Edge)) {
 			throw new TypeError("Edge constructor cannot be called as a function");
 		}
 		// Create edge
 		this.vertexIndices = vertexIndices;
 		this.faceIndices = [];
 	}

 	// Generic public constructor
 	Edge.create = function(vertexIndices) {
 		var edge = new Edge(vertexIndices);
 		return edge;
 	}

 	// Prototype
 	Edge.prototype = {
 		// Repoint the constructor for prototype definition
 		constructor: Edge,

 		// Get midpoint of an edge
 		midpoint: function(mesh) {
 			//Sum the edges two vertex vectors
 			var returnValue = mesh.vertices[this.vertexIndices[0]].vec.clone()
										 			.add(mesh.vertices[this.vertexIndices[1]].vec)
										 			.divideScalar(2);
 			return returnValue;
 		},

 		// Get the midpoint of an edge (using endpoints and faces) 
 		getEdgePoint: function(mesh) {
 			// Number of faces for edge (2)
 			var numOfFacesAdjacent = this.faceIndices.length;

 			// Temp var to keep track
 			var sumOfVertPositions = new Vector();
 			var averageOfVertPositions = new Vector();
 			sumOfVertPositions.clear();
 			averageOfVertPositions.clear();

 			// For every vertex index of the edge
 			for (var vi = 0; vi < this.vertexIndices.length; vi++) {
 				var vertexIndex = this.vertexIndices[vi];
 				var vertexVector = mesh.vertices[vertexIndex].vec;

 				// Add them
 				sumOfVertPositions.add(vertexVector);
 			}

 			// For each face of the edge
 			for (var fi = 0; fi < this.faceIndices.length; fi++) {
 				// Face index
 				var faceIndex = this.faceIndices[fi];
 				// Face point
 				var facePoint = mesh.facePoints[faceIndex];
 				// Add face point
 				sumOfVertPositions.add(facePoint);
 			}

 			/// Number of verts that were added
 			var numVerts = this.vertexIndices.length + this.faceIndices.length;

 			// Get average
 			averageOfVertPositions.overwriteWith(sumOfVertPositions)
 														.divideScalar(numVerts);


 		},

 		// Return the vectors of the vertices for this edge in the main array
 		vertexPositions: function(mesh) {
 			var returnValue = [
 				mesh.vertices[this.vertexIndices[0]].vec,
 				mesh.vertices[this.vertexIndices[1]].vec
 			];

 			return returnValue;
 		}

 	} // End prototype

 	// Return reference to the constructor
 	return Edge;

 }); // End define