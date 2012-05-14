// Generated by CoffeeScript 1.3.1
(function() {
  var __slice = [].slice;

  window.RotatingCalipers = (function() {
    /* PRIVATE
    */

    var _distance, _inputVertices, _quickHull;

    RotatingCalipers.name = 'RotatingCalipers';

    _inputVertices = null;

    /*
      #._distance
      @sign Number _distance(Array start, Array end, Array point)
      @param start - the start point forming the dividing line.
      @param end - the end point forming the dividing line.
      @param point - the point from which the distance to the line is calculated.
      Find the distance between a point and a line formed by a start and end points.
      All params have first index as the x and second index as y coordinate.
    
      The real distance value could be calculated as follows:
    
      Calculate the 2D Pseudo crossproduct of the line vector (start 
      to end) and the start to point vector. 
      ((y2*x1) - (x2*y1))
      The result of this is the area of the parallelogram created by the 
      two given vectors. The Area formula can be written as follows:
      A = |start->end| h
      Therefore the distance or height is the Area divided by the length 
      of the first vector. This division is not done here for performance 
      reasons. The length of the line does not change for each of the 
      comparison cycles, therefore the resulting value can be used to 
      finde the point with the maximal distance without performing the 
      division.
    
      Because the result is not returned as an absolute value its 
      algebraic sign indicates of the point is right or left of the given 
      line
    */


    _distance = function(start, end, point) {
      return (point[1] - start[1]) * (end[0] - start[0]) - (point[0] - start[0]) * (end[1] - start[1]);
    };

    /*
      #._quickHull
      @sign Array _quickHull(Array vertices, Array start, Array end)
      @param vertices - Contains the set of points to calculate the hull for.
                        Each point is an array with the form [x, y].
      @param start - The start point of the line, in the form [x, y].
      @param end - The end point of the line, in the form [x, y].
      @return set of points forming the convex hull, in clockwise order.
      Execute a QuickHull run on the given set of points, using the provided 
      line as delimiter of the search space.
    */


    _quickHull = function(vertices, start, end) {
      var d, maxDistance, maxPoint, newPoints, vertex, _i, _len;
      maxPoint = null;
      maxDistance = 0;
      newPoints = [];
      for (_i = 0, _len = vertices.length; _i < _len; _i++) {
        vertex = vertices[_i];
        if (!((d = _distance(start, end, vertex)) > 0)) {
          continue;
        }
        newPoints.push(vertex);
        if (d < maxDistance) {
          continue;
        }
        maxDistance = d;
        maxPoint = vertex;
      }
      /*
          The current delimiter line is the only one left and therefore a 
          segment of the convex hull. Only the end of the line is returned 
          to not have points multiple times in the result set.
      */

      if (!(maxPoint != null)) {
        return [end];
      }
      /*
          The new maximal point creates a triangle together with start and 
          end, Everything inside this trianlge can be ignored. Everything 
          else needs to handled recursively. Because the quickHull invocation 
          only handles points left of the line we can simply call it for the 
          different line segements to process the right kind of points.
      */

      return _quickHull(newPoints, start, maxPoint).concat(_quickHull(newPoints, maxPoint, end));
    };

    /* PUBLIC
    */


    /*
      #RotatingCalipers.constructor
      @sign void constructor(Array vertices)
      @sign void RotatingCalipers(Array vertex, Array vertex, Array vertex[, Array vertex...])
      @param vertices - An array contains vertices in form of an array. Can also take 
                        each vertex as arguments
    */


    function RotatingCalipers(verticesOrFirst) {
      var rest, vertex, vertex1, vertex2, vertex3, _i, _len;
      if (!(verticesOrFirst != null)) {
        throw new Error("Argument required");
      }
      if (!(verticesOrFirst instanceof Array) || verticesOrFirst.length < 3) {
        throw new Error("Array of vertices required");
      }
      vertex1 = verticesOrFirst[0], vertex2 = verticesOrFirst[1], vertex3 = verticesOrFirst[2], rest = 4 <= verticesOrFirst.length ? __slice.call(verticesOrFirst, 3) : [];
      for (_i = 0, _len = verticesOrFirst.length; _i < _len; _i++) {
        vertex = verticesOrFirst[_i];
        if (!(vertex instanceof Array) || vertex.length < 2) {
          throw new Error("Invalid vertex");
        }
        if (isNaN(vertex[0]) || isNaN(vertex[1])) {
          throw new Error("Invalid vertex");
        }
      }
      _inputVertices = verticesOrFirst;
    }

    /*
      #RotatingCalipers.convexHull
      @sign Array convexHull(void)
      @return an Array of the points forming the minimal convex set containing all
              input vertices.
      Calculates the convex hull of the arbitrary vertices defined in constructor.
    */


    RotatingCalipers.prototype.convexHull = function() {
      var extremeX, finder;
      finder = function(arr) {
        var el, ret, _i, _len;
        ret = [];
        ret[0] = ret[1] = arr[0];
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          el = arr[_i];
          if (el[0] < ret[0][0]) {
            ret[0] = el;
          }
          if (el[0] > ret[0][0]) {
            ret[1] = el;
          }
        }
        return ret;
      };
      extremeX = finder(_inputVertices);
      return _quickHull(_inputVertices, extremeX[0], extremeX[1]).concat(_quickHull(_inputVertices, extremeX[1], extremeX[0]));
    };

    return RotatingCalipers;

  })();

}).call(this);
