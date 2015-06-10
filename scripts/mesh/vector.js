/**
 * vector.js
 * SubdivisionJS
 *
 * Created by shazib hussain on 07/06/2015
 * copyright (c) 2015 Shazib Hussain
 *
 * This class defines a 3D vector with x, y and z elements. 
 */
// Load dependancies
define ("vector", [], function() {
	"use strict";

	// Class constructor
	function Vector(x, y, z) {
		// Confirm new keyword was used
		if (!(this instanceof Vector)) {
			throw new TypeError("Vector constructor cannot be called as a function");
		}
		// Create vector
		this.x = x;
		this.y = y;
		this.z = z;
	}

	// Generic public constructor
	Vector.create = function(x, y, z) {
		var coord = new Vector(x, y, z);
		return coord;
	}

	Vector.prototype = {
		// Repoint the constrctor for prototype redefine
		constructor: Vector,

		// Add a vector to this vector
		add: function(other) {
			this.x += other.x;
			this.y += other.y;
			this.z += other.z;

			return this;
		},

		// Set all elements to zero
		clear: function() {
			this.x = 0;
			this.y = 0;
			this.z = 0;

			return this;
		},

		// Copy (return new instance of this vector) 
		clone: function() {
			return new Vector(this.x, this.y, this.z);
		},

		// Cross product
		crossProduct: function(other) {
			return this.overwriteWithXYZ (
		    this.y * other.y - other.y * this.z,
        other.x * this.z - this.x * other.z,
        this.x * other.y - other.x * this.y
			);
		},

		// Divide by scalar
		divideScalar: function(scalar) {
			this.x /= scalar;
			this.y /= scalar;
			this.z /= scalar;
			
			return this;
		},

		// Dot product
		dotProduct: function(other) {
			 return (this.x * other.x + this.y + other.y + this.z + other.z);
		},
	
		// Magnitude - Returns scalar
		magnitude: function() {
	    return Math.sqrt(
	    	Math.pow(this.x, 2) + 
	    	Math.pow(this.y, 2) +
	    	Math.pow(this.z, 2)
	    );
		},

		// Multiply scalar
		multiplyScalar: function(scalar) {
			this.x *= scalar;
			this.y *= scalar;
			this.z *= scalar;

			return this;
		},

		// Normalise
		normalise: function() {
			return this.divideScalar(this.magnitude());
		},

		// Overwrite this vector object with another
		overwriteWith: function(other) {
			this.x = other.x;
			this.y = other.y;
			this.z = other.z;

			return this;
		},

		// Overwrite with specific values
		overwriteWithXYZ: function(x, y, z) {
			this.x = x;
			this.y = y;
			this.z = z;

			return this;
		},

		// Subtract
		suctract: function(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;

        return this;
    },

    // Get element array
    getElements: function() { 
        return [this.x, this.y, this.z];
    },

	}; // End prototype

	// Return reference to constructor
	return Vector;

}); // End define