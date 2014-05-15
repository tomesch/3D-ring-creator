define(function () {
  'use strict';
  var Constraint = function () {
  };

  Constraint.prototype.isHeightmapValid = function (heightmap, width, MAX_SLOPE) {
    //Performs an all pairs of points the following test:
    //If the slope ('pente') of the line between any pair of 2 points
    //is higher than our max value, we return false
    //So it makes (n^2 - n) / 2 tests (worst case) where n is the number of points
    var
    slope = 0.0,
    i = 0,
    j = 0,
    iCoord = [],
    jCoord = [],
    vector = [];

    for (i = 0; i < heightmap.length; i++)  {
      //i<j: don't run the same test twice
      for (j = 0; i < j, j < heightmap.length; j++) {
        //Must be a real pair of points ie not the same
        if (j === i) {
          break;
        }
        //Points in the image are in this order in the array:
        //left-to-right order, row by row top to bottom, starting with the top left

        //X
        iCoord[0] = i % width;
        jCoord[0] = j % width;
        //Y
        iCoord[1] = Math.floor(i / width);
        jCoord[1] = Math.floor(j / width);
        //Z
        iCoord[2] = heightmap[i];
        jCoord[2] = heightmap[j];

        //Vector of the line between the 2 points
        //X
        vector[0] = iCoord[0] - jCoord[0];
        //Y
        vector[1] = iCoord[1] - jCoord[1];
        //Z
        vector[2] = iCoord[2] - jCoord[2];

        //Vector's norm squared
        slope = vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2];

        if (slope > MAX_SLOPE * MAX_SLOPE) {
          return false;
        }
      }
    }
    return true;
  };

  return Constraint;

});
