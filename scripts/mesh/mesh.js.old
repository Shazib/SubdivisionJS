/**
 * mesh.js
 * SubdivisionJS
 *
 * Created by shazib hussain on 07/06/2015
 * copyright (c) 2015 Shazib Hussain
 *
 * This class represents a 3D mesh.
 * The class stores a list of edges, vertices and faces
 */

// Load dependancies
define ("mesh", ["vector", "vertex", "edge", "face"], 
	function(Vector, Vertex, Edge, Face) {
	"use strict";

	// Class constructor
	// Name = name of mesh
	// vertices = list of vertexes 
	// vertexIndicesForFaces = 2d array assigning the vertexes to faces
	function Mesh(name, vertices, vertexIndicesForFaces) {
		// Name of mesh
		this.name = name;
		// Array of mesh vertices
		this.vertices = vertices;
		// Array of mesh faces
		this.faces = [];
		// Array of mesh edges
		this.edges = [];

		var vertexIndicesMinMaxToEdgeIndexLoopup = [];
		// Generate mesh faces
		for (var f = 0; f < vertexIndicesForFaces.length; f++) {
			// Array of vertices for this face
			var vertexIndicesForFace = vertexIndicesForFaces[f];

			// New face with its vertex indexes
			var face = new Face(vertexIndicesForFace);

			// number of vertices in face
			var numVertsInFace = vertexIndicesForFace.length;

			// For each vertex in the face
			for (var vi = 0; vi < numVertsInFace; vi++) {
				// Get the first two vertex indices of the face
				var viNext = (vi + 1) % numVertsInFace;

				// Get the indexes from the faces index array
				var vertIndex = vertexIndicesForFace[vi];
				var vertIndexNext = vertexIndicesForFace[viNext];

				// Get the actual vertices from the Meshes array
				var vert = this.vertices[vertIndex];
				var vertNext = this.vertices[vertIndexNext];

				// This face belongs to the vertex as well as 
				// the vertex belonging to this face. 
				// So now update the vertex's index lists
				vert.faceIndices.push(f);

				// These two vertices make an edge also,
				// Get the larger index value of the two vertices 
				var vertIndexMax = Math.max(vertIndex, vertIndexNext);
				var vertIndexMin = Math.min(vertIndex, vertIndexNext);

				// Try to get the index of the edge
				var vertIndexMaxToEdgeIndexLookup = 
					vertexIndicesMinMaxToEdgeIndexLoopup[vertIndexMin];

				// If no index of the edge 
				if (vertIndexMaxToEdgeIndexLookup == null) {
					// Clean array
					vertIndexMaxToEdgeIndexLookup = [];
					// Clean main array
					vertexIndicesMinMaxToEdgeIndexLoopup[vertIndexMin] =
						vertIndexMaxToEdgeIndexLookup;
				}

				// Get edge index
				var edgeIndex = vertIndexMaxToEdgeIndexLookup[vertIndexMax];

				// If index doesnt exist
				if (edgeIndex == null) {
					// Create a new edge and add it to the meshes array of edges
					var edge = new Edge([vertIndexMin, vertIndexMax]);
					edgeIndex = this.edges.length; // index in the end of the array
					this.edges.push(edge);
				}

				// Now add the index of this edge in the main array
				// to the Face object. So it knows all its edges
				vertIndexMaxToEdgeIndexLookup[vertIndexMax] = edgeIndex;

				// If not already in the array 
				if (face.edgeIndices.indexOf(edgeIndex) == -1) {
					face.edgeIndices.push(edgeIndex);
				}

			} // End of for each vertex in face


			for (var ei = 0; ei < face.edgeIndices.length; ei++) {
				// Get location of edge in main array
				var edgeIndex = face.edgeIndices[ei];
				// Get edge from main array
				var edge = this.edges[edgeIndex];
				// Each edge must know its assocciated faces
				// Add the face to the edge
				edge.faceIndices.push(f);

				// For each vertex of the edge

				for (var vi = 0; vi < edge.vertexIndices.length; vi++) {
					// Get the vertex index in main array
					var vertexIndex = edge.vertexIndices[vi];
					// Get the actual vertex from main array
					var vertex = this.vertices[vertexIndex];

					// Each vertex needs to know its edges
					// Add the edge to the vertices
					if (vertex.edgeIndices.indexOf(edgeIndex) == -1) {
						vertex.edgeIndices.push(edgeIndex);
					}
				}
			}

			// Add the face to the model
			this.faces.push(face)

		} // End mesh faces

	} // End constructor

	// Generic public constructor?

	// Prototype
	Mesh.prototype = {
		// repoint the constructor for prototype definition
		constructor: Mesh,

		// Catmull Clark subdivision method
		catmullSubdivide: function() {
            // Catmull Clark subdivision of mesh
            var numberOfFacesOriginal = this.faces.length;
            var numberOfEdgesOriginal = this.edges.length;
            var numberOfVerticesOriginal = this.vertices.length;

            var facePoints = [];
            var edgePoints = [];

            var sumOfVertexPositions = new Vector();
            var averageOfVertexPositions = new Vector();

            // For every face (Generate face points)
            for (var f = 0; f < numberOfFacesOriginal; f++) {
                facePoints.push(this.faces[f].getFacePoint(this).clone());
              //   var face = this.faces[f];
              //  // console.log(face.vertexIndices);
              //   var numberOfVerticesInFace = face.vertexIndices.length;
              //   sumOfVertexPositions.clear();

              //   for (var vi = 0; vi < numberOfVerticesInFace; vi++)
              //   {
              //       var vertexIndex = face.vertexIndices[vi];
              //       var vertexPos = this.vertices[vertexIndex].vec;
              //       sumOfVertexPositions.add(vertexPos);
              //   }
              //  // console.log(sumOfVertexPositions);
              //   averageOfVertexPositions.overwriteWith
              //   (
              //       sumOfVertexPositions
              //   ).divideScalar
              //   (
              //       numberOfVerticesInFace
              //   );
              // //  console.log(averageOfVertexPositions)
              //   facePoints.push(averageOfVertexPositions.clone());
            } // End of for each face
          //  console.log(facePoints);

            // For each edge (generate edge points)
            for (var e = 0; e < numberOfEdgesOriginal; e++) {
                var edge = this.edges[e];

                sumOfVertexPositions.clear();

                // For all vertex indexes of edge
                for (var vi = 0; vi < edge.vertexIndices.length; vi++) {
                    // Get the Coord from the vertex from global
                    var vertexIndex = edge.vertexIndices[vi];
                    var vertexPos = this.vertices[vertexIndex].vec;
                    // Add up
                    sumOfVertexPositions.add(vertexPos);
                }

                // Number of faces touching edge
                var numberOfFacesAdjacent = edge.faceIndices.length;

                // For each face of edge
                for (var fi = 0; fi < numberOfFacesAdjacent; fi++) {
                    // Get the global face index of the adjacent face
                    var faceIndex = edge.faceIndices[fi];
                    // Get the newly created face point for that face 
                    var facePoint = facePoints[faceIndex];
                    // Add face point
                    sumOfVertexPositions.add(facePoint);
                }
                // Number of vertices summed
                var numberOfVertices = edge.vertexIndices.length
                    + numberOfFacesAdjacent;

                averageOfVertexPositions.overwriteWith(sumOfVertexPositions)
                    .divideScalar(numberOfVertices);

                // Add edge point to new edge points array
                edgePoints.push(averageOfVertexPositions.clone());
            } // End for each edge

           // console.log(edgePoints);

            // Generate new edges from face to edge points
            // For each face 
            var edgesFromFaceToEdgePoints = [];

            for (var f = 0; f < numberOfFacesOriginal; f++) {
                // Get the face
                var face = this.faces[f];
                // get new face point
                var facePoint = facePoints[f];

                // Get number of edges in face (4)
                var numberOfEdgesInFace = face.edgeIndices.length

                // For every edge of the face
                for (var ei = 0; ei < numberOfEdgesInFace; ei++) {
                    // Index of edge in global array
                    var edgeIndex = face.edgeIndices[ei];
                    // Edge point
                    var edgePoint = edgePoints[edgeIndex]; // points in the middle of edges

                    var edgeFromFacePointToEdgePoint = 
                    [
                        numberOfVerticesOriginal 
                            + numberOfEdgesOriginal
                            + f,
                        numberOfVerticesOriginal 
                            + edgeIndex
                    ];

                    // Add edgepoint >> facepoint edge
                    edgesFromFaceToEdgePoints.push(edgeFromFacePointToEdgePoint);
                }
            } // end for each face
           // console.log(edgesFromFaceToEdgePoints);

            // Generate new original vertex to edge point edges
            var edgesFromVerticesToEdgePoints = []; // new edges from vertices to edge points (splitting in 2)

            var verticesNew = [];

            // For every vertex
            for (var v = 0; v < this.vertices.length; v++) {
                // get the vertex
                var vertex = this.vertices[v];
                console.log(vertex);
                // Get the vertex vector
                var vertexPos = vertex.vec;
             //   console.log(vertexPos);
                // Edges and faces adjacent to vertex
                // Are these always the same???
                var numberOfFacesAdjacent = vertex.faceIndices.length;
                var numberOfEdgesAdjacent = vertex.edgeIndices.length;

                sumOfVertexPositions.clear();
              //  console.log(numberOfFacesAdjacent);
                // For every face adjacent to vertex
                for (var fi = 0; fi < numberOfFacesAdjacent; fi++) {
                    // Get the index of the face
                    var faceIndex = vertex.faceIndices[fi];
                    // get the new face point for that face
                    var facePoint = facePoints[faceIndex];

                    // sum all the face points for adjacent faces
                    sumOfVertexPositions.add(facePoint);
                }
                // Get the average of all adjacent face points
             //   console.log(sumOfVertexPositions);
                var averageOfFacePointsAdjacent = 
                sumOfVertexPositions.clone().divideScalar
                (
                    numberOfFacesAdjacent
                );

              //  console.log(averageOfFacePointsAdjacent);

                sumOfVertexPositions.clear();

                // For every edge adjacent to the vertex
                for (var ei = 0; ei < numberOfEdgesAdjacent; ei++) {
                    // Get index of edge in global array
                    var edgeIndex = vertex.edgeIndices[ei];
                    // get the edge
                    var edge = this.edges[edgeIndex];

                    // Get midpoint of edge
                    var edgeMidPoint = edge.midpoint(this); // What??

                    sumOfVertexPositions.add(edgeMidPoint);

                    // new point from vertex to edge midpoint
                    var edgeFromVertexToEdgePoint = 
                    [
                        v,
                        numberOfVerticesOriginal + edgeIndex
                    ];

                    // add to new edges array
                    edgesFromVerticesToEdgePoints.push
                    (
                        edgeFromVertexToEdgePoint
                    );
                }

                // Average of edge midpoints 
                var averageofEdgeMidpointsAdjacent = sumOfVertexPositions.clone()
                			.divideScalar(numberOfEdgesAdjacent)

                // New position of vertex - using catmull clark
                var vertexNewPos = vertexPos.clone().multiplyScalar(numberOfFacesAdjacent - 3)
                                                    .add(averageOfFacePointsAdjacent)
                                                    .add(averageofEdgeMidpointsAdjacent)
                                                    .add(averageofEdgeMidpointsAdjacent) // again
                                                    .divideScalar(numberOfFacesAdjacent);

                verticesNew.push(new Vertex(vertexNewPos))
            }

            // Generate an array of verticies from an array of positions
            // Add to verticesNew
            verticesNew.append( Vertex.manyFromVectors(edgePoints));
            verticesNew.append( Vertex.manyFromVectors(facePoints));
            //console.log(facePoints);
            //console.log(verticesNew);
            // locations of vertexes in global array for the new faces
            var vertexIndicesForFacesNew = [];

            // For Every Face
            for (var f= 0; f < numberOfFacesOriginal; f++) {
                // Get original face
                var faceOriginal = this.faces[f];
                // Get new face point
                var facePoint = facePoints[f];

                // For every vertex index in the original face
                for (var vi = 0; vi < faceOriginal.vertexIndices.length; vi++) {
                    // Get the index
                    var vertexIndex = faceOriginal.vertexIndices[vi];
                    // get the vertex from global array
                    var vertexOriginal = this.vertices[vertexIndex]; 
                    // New vertex from the new edge points and face points
                    var vertexNew = verticesNew[vertexIndex];

                    var edgeIndicesShared = [];

                    // For every edge in the vertexes of the face
                    for (var ei = 0; ei < vertexOriginal.edgeIndices.length; ei++) {
                        // Get index of edge in the global array
                        var edgeIndex = vertexOriginal.edgeIndices[ei];

                        // For every edge in the face
                        for (var ei2 = 0; ei2 < faceOriginal.edgeIndices.length; ei2++) {
                            // Index of edge in global array
                            var edgeIndex2 = faceOriginal.edgeIndices[ei2];

                            // If they are the same
                            if (edgeIndex2 == edgeIndex) {
                                edgeIndicesShared.push(edgeIndex);
                            }
                        }
                    }

                    // New vertex indicies for face
                    var vertexIndicesForFaceNew =
                    [
                        // Face point
                        numberOfVerticesOriginal + numberOfEdgesOriginal + f,
                        // Edge point 0
                        numberOfVerticesOriginal + edgeIndicesShared[0],
                        // Corner vertex
                        vertexIndex,
                        // Edge point 1
                        numberOfVerticesOriginal + edgeIndicesShared[1]
                    ];
                    vertexIndicesForFacesNew.push(vertexIndicesForFaceNew)
                }
            }
            // Return the new mesh
            var returnValue = new Mesh 
            (
                "Subdivided",
                verticesNew,
                vertexIndicesForFacesNew
            );

            return returnValue;
        }, // End subdivide 

        // Get An aray of the vectors suited to wireframe gl.LINES
        wireframeVertices: function() {
            var vertices = [];
            // For every edge
            for (var e = 0; e < this.edges.length; e++) {
                // Get the edge
                var edge = this.edges[e];
                // Get the vertex indexes for edge
                var vi1 = edge.vertexIndices[0];
                var vi2 = edge.vertexIndices[1];
                // Get the vectors
                var vect1 = this.vertices[vi1];
                var vect2 = this.vertices[vi2];
                // Push these two vertices vectors
                vertices.push(vect1.vec.x * 1.001);
                vertices.push(vect1.vec.y * 1.001);
                vertices.push(vect1.vec.z * 1.001);

                vertices.push(vect2.vec.x * 1.001);
                vertices.push(vect2.vec.y * 1.001);
                vertices.push(vect2.vec.z * 1.001);        
            }
            return vertices  
        },

        // Get the vector array  as is
        vectorArray: function() {
        	// Create array from the vector
        	var vertices = [];
        	// for each vertex
        	for (var vi = 0; vi < this.vertices.length; vi++) {
        		// Get elements of vector
        		vertices.append(this.vertices[vi].vec.getElements());
        	}
        	return vertices;
        },

        // Get element array for triangles
        elementArray: function() {
            var vertices = [];
            // For each face 
            for (var f = 0; f < this.faces.length; f++) {
                // Get the four vertex indexes
                var v0 = this.faces[f].vertexIndices[0];
                var v1 = this.faces[f].vertexIndices[1];
                var v2 = this.faces[f].vertexIndices[2];
                var v3 = this.faces[f].vertexIndices[3];


                // Add them in a 3/3 fashion for two triangles
                vertices.push(v0)
                vertices.push(v1)
                vertices.push(v2) // Triangle 1

                vertices.push(v0)
                vertices.push(v2)
                vertices.push(v3) // Triangle 2 

            }
            return vertices;
        },

        // Doo Sabin subdivision method
        doosabinSubdivide: function() {

        }
	} // End prototype

	// Return reference to constructor
	return Mesh;

}); // End define