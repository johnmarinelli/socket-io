var lifePatterns = {
  'single-cell': [ [1] ],

  'r-pentomino': [ [0, 1, 1],
                   [1, 1, 0],
                   [0, 1, 0] ],

  'square': [ [1, 1, 1],
              [1, 1, 1],
              [1, 1, 1] ],

  'glider': [ [0, 0, 1],
              [1, 0, 1],
              [0, 1, 1] ],

   'pulsar': [ [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
               [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
               [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
               [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
               [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
               [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
               [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
               [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
               [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
               [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0] ],
};

var CAPredefinedShapes = (function(lifePatterns){
  // returns selected shape given a name.
  this.getCurrentSelected = function(name) {
    return lifePatterns[name];
  };

  // iterates over a given shape.
  // uses: drag & drop hover effect,
  //       drag & drop placement
  this.iterateOverShape = function(shape, cb) {
    var shapeHeight = shape.length,
        i = 0;

    for ( ; i < shapeHeight; ++i) {
      var shapeWidth = shape[i].length,
          j = 0;
      for ( ; j < shapeWidth; ++j) {
        // send the cell at index and its coordinates
        cb(shape[i][j], [i, j]);
      }
    }
  };

  return this;
})(lifePatterns);
