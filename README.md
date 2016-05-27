#SubdivisionJS

SubdivisionJS is a JavaScript library which provides a simple 3-Dimensional Geometry model for modelling and subdividing 3D meshes and methods for exporting the mesh to WebGL buffers. The library implements a B-Rep model for defining meshes and uses the model to perform subdivisions.

This library was created as part of a MSc thesis.

##### The library supports the following subdivision algorithms:
* Catmull-Clark
* Doo-Sabin
* Loop

##### The Core library consists of The following:
* Mesh.js
* Face.js
* Edge.js
* Vertex.js
* Vector.js
* Extensions.js

These files implement the Mesh B-Rep model and subdivision algorithms.

##### Working Example
The files index.html, app.js, glhelper.js and Models.js implement a fully functional demonstration tool which generates and subdivides models using the library and then displays them via WebGL.

##### Demo
Click [Here](http://shazib.com) to go to the demo
