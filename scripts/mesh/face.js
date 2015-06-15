/**
 * face.js
 * SubdivisionJS
 *
 * Created by shazib hussain on 07/06/2015
 * copyright (c) 2015 Shazib Hussain
 *
 * This class defines a face of a 3D mesh . 
 * The face stores vertex and edge locations.
 */

// Load dependencies
define ("face", ["mesh", "vector"], function(Face, Vector) {
	"use strict";

	// Class constructor
	function Face(vertexIndices) {
		// Array of vertex indexes in main array
		this.vertexIndices = vertexIndices;
		// Array of edge indexes in main array
		this.edgeIndices = []; 
	}

	// Generic public constructor 
	Face.create = function(vertexIndices) {
		// Array of vertex indexes in main array
		this.vertexIndices = vertexIndices;
		// Array of edge indexes in main array
		this.edgeIndices = [];

		return this;
	}

	// Prototype
	Face.prototype = {
		// Repoint the constructor for prototype definition
		constructor: Face,

		// Get face point for catmull-clark
		getFacePoint: function(mesh) {
			// Number of vertices in face
			var numVertsInFace = this.vertexIndices.length;

			// Temp var to calculate average
			var sumOfVertPositions = new Vector();
			var averageOfVertPositions = new Vector();
			sumOfVertPositions.clear();
			averageOfVertPositions.clear();

			// For every vertex in the face
			for (var vi = 0; vi < numVertsInFace; vi++) {
				var vertIndex = this.vertexIndices[vi];
				var vertexVector = mesh.vertices[vertIndex].vec;

				// Add them
				sumOfVertPositions.add(vertexVector);
			}
			// Get the average
			averageOfVertPositions.overwriteWith(sumOfVertPositions)
														.divideScalar(numVertsInFace);

			// Return face point vector
			return averageOfVertPositions;
		},

		getCenter: function(mesh) {
			// For every edge
			var numEdges = this.edgeIndices.length;

			// Temp var to calculate average
			var sumOfVertPositions = new Vector();
			var averageOfVertPositions = new Vector();
			sumOfVertPositions.clear();
			averageOfVertPositions.clear();

			for (var ei = 0; ei < numEdges; ei++) {
				var edgeIndex = this.edgeIndices[ei];
				var edge = mesh.edges[edgeIndex];
				var vector = edge.midpoint(mesh);


				// Add them up
				sumOfVertPositions.add(vector);
			}
			// Get average
			averageOfVertPositions.overwriteWith(sumOfVertPositions)
														.divideScalar(numEdges);
			return averageOfVertPositions;
		}

	} // End prototype

	// Return reference to constructor
	return Face;

}); // End define