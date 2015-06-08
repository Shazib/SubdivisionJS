/**
 * models.js
 * SubdivisionJS
 *
 * Created by shazib hussain on 07/06/2015
 * copyright (c) 2015 Shazib Hussain
 *
 * This class contains convenience 3D meshes
 * This class create and returns meshes 
 */
define ("models", ["mesh", "vertex", "vector"], function(Mesh, Vertex, Vector) {
 	"use strict";

 	// Class constructor
 	function Models() {
 		//
 	} // End constructor

 	// Static cube method
  Models.cube = function() {
      return new Mesh(
          "Cube",
          // vertices
          [
            new Vertex(new Vector(-1, -1, 1)), // 0
            new Vertex(new Vector(1, -1, 1)), // 1
            new Vertex(new Vector(1, 1, 1)), // 2
            new Vertex(new Vector(-1, 1, 1)), // 3
            new Vertex(new Vector(-1, -1, -1)), // 4
            new Vertex(new Vector(-1, 1, -1)), // 5
            new Vertex(new Vector(1, 1, -1)), // 6
            new Vertex(new Vector(1, -1, -1)), // 7
          ],
          // vertexIndicesForFaces
          [
            [ 0, 1, 2, 3 ], // top
            [ 0, 3, 5, 4 ], // north
            [ 3, 2, 6, 5 ], // east
            [ 2, 1, 7, 6 ], // south
            [ 1, 0, 4, 7 ], // east
            [ 4, 5, 6, 7 ], // bottom
          ]
      );
  }

  Models.torus = function() {
  	return new Mesh (
      "Torus",
      [
        new Vertex( new Vector( 6.062324, 2.694626, 2.226883)),
        new Vertex( new Vector( 5.812324, 2.944626, 2.226883)),
        new Vertex( new Vector( 5.562324, 2.694626, 2.226883)),
        new Vertex( new Vector( 5.812324, 2.444626, 2.226883)),
        new Vertex( new Vector( 4.812324, 2.694626, 0.976883)),
        new Vertex( new Vector( 4.812324, 2.944626, 1.226883)),
        new Vertex( new Vector( 4.812324, 2.694626, 1.476883)),
        new Vertex( new Vector( 4.812324, 2.444626, 1.226883)),
        new Vertex( new Vector( 3.562324, 2.694626, 2.226883)),
        new Vertex( new Vector( 3.812324, 2.944626, 2.226883)),
        new Vertex( new Vector( 4.062324, 2.694626, 2.226883)),
        new Vertex( new Vector( 3.812324, 2.444626, 2.226883)),
        new Vertex( new Vector( 4.812324, 2.694626, 3.476883)),
        new Vertex( new Vector( 4.812324, 2.944626, 3.226883)),
        new Vertex( new Vector( 4.812324, 2.694626, 2.976883)),
        new Vertex( new Vector( 4.812324, 2.444626, 3.226883))
      ],

      [
        [0, 4, 5, 1],
        [1, 5, 6, 2],
        [2, 6, 7, 3],
        [0, 3, 7, 4],
        [4, 8, 9, 5],
        [5, 9, 10, 6],
        [6, 10, 11, 7],
        [7, 11, 8, 4],
        [8, 12, 13, 9],
        [9, 13, 14, 10],
        [10, 14, 15, 11],
        [11, 15, 12, 8],
        [12, 0, 1, 13],
        [13, 1, 2, 14],
        [14, 2, 3, 15],
        [15, 3, 0, 12]
      ]
  	);   
  }

  return Models;



 }); // End define