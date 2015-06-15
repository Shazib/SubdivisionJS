// Extending array
define([], function() {
		"use strict";

	// Extend Array to append
    Array.prototype.append = function(other) {
        for (var i = 0; i < other.length; i++){
            this.push(other[i]);
        }
        return {
        	array: this
        };
    }

    // Extend array to intersect
    Array.prototype.intersect = function(other) {
        for (var i = 0; i <this.length; i++) {
            for (var j = 0; j < other.length; j++ ) {

                if (this[i] == other[j]) {
                    return this[i];
                } 
            }
        }
        console.log("no match");
        return -1;
    }

    /// Method for getting last  value in array
    Array.prototype.last = function() {
        return this[this.length - 1];
    }

    Array.prototype.pushIfNotExists = function(other) {
        if (this.indexOf(other) == -1) {
            this.push(other);
          //  console.log("doesnt exist");
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