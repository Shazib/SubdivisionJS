// Extending array
define([], function() {
		"use strict";

		// Extend Array
    Array.prototype.append = function(other) {
        for (var i = 0; i < other.length; i++){
            this.push(other[i]);
        }
        return {
        	array: this
        };
    }

    // Extend math
    Math.degToRad = function(deg) {
			var res = deg * Math.PI / 180.0;

			return res;
    }

}); // End defines