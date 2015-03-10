//var Cell = require('./Cell.js').Cell;
//var HashTable = require('./HashTable.js').HashTable;

// 2d adjacency matrix (mCells) for quick neighbor counting & save space
// hashtables for actual manipulation of cells
function World(graph) {
  // physical representation of graph
  this.mGraph = graph;

  // 2d adjacency matrix
  this.mCells = [];

  var height = graph.mRows,
      y = 0;

  for ( ; y < height; ++y) {
    this.mCells[y] = [];
  }

  function hasher(x, y) {
    return (x ^ (y << 1) >> 1);
  }
  
  // hash table for living cells
  this.mLiving = new HashTable(hasher); 
  
  // hash table for dead cells
  this.mDead = new HashTable(hasher);

  this.mCellWidth = graph.mColumnWidth;
  this.mCellHeight = graph.mRowHeight;

  this.countNeighbors = function(x, y) {
    // x, y will be center; need to move to top left corner
    x = x - 1;
    y = y - 1;

    // put x into (0, colCount)
    x = Math.max(0, x);
    x = Math.min(x, this.mGraph.mCols);

    // put y into (0, rowCount)
    y = Math.max(0, y);
    y = Math.min(y, this.mGraph.mRows);

    var neighborCount = 0;

    for (var i = 0; i < 3; ++i) {
      var row = this.mCells[y+i];
      for (var j = 0; j < 3; ++j) {
        if (undefined !== row && i !== 1 && j !== 1) {
          var cell = row[x+j];
          if (undefined !== cell) {
            cell ? neighborCount++ : 0;
          }
        }
      }
    }

    return neighborCount;
  };
}

World.prototype.addCell = function(x, y, alive) {
  alive = alive || false;

  if (x > this.mGraph.mCols || y > this.mGraph.mRows) {
    throw 'Coordinates out of range';
  }

  var c = new Cell(x, y, alive);
  this.mCells[y][x] = true;

  if (alive) this.mLiving.insert(c);
  else this.mDead.insert(c);
};

World.prototype.getCell = function(x, y) {
  return this.mCells[y][x];
};

World.prototype.reviveCell = function(x, y) {
  var cell = this.getCell(x, y);
  if (!cell) {
    console.log('No cell at (' + x + ', ' + y + ')');
    return false;
  }
  cell.mAlive = true;
  this.mCells[y][x] = 1;
  this.mLiving.insert(cell);
  this.mDead.remove(cell);
}

World.prototype.killCell = function(x, y) {
  var cell = this.getCell(x, y);
  if (!cell) {
    console.log('No cell at (' + x + ', ' + y + ')');
    return false;
  }
  cell.mAlive = false;
  this.mCells[y][x] = 0;
  this.mLiving.remove(cell);
  this.mDead.insert(cell)
};

World.prototype.update = function() {
  var world = this;

  // store cells to be revived/killed in separate arrays,
  // then revive/kill them as necessary.
  // this is to preserve state of each cell during the algorithm

  this.mLiving.forEach(function(cell) {
    var neighborCount = world.countNeighbors(cell.mX, cell.mY);
    console.log(neighborCount);
  });
};

World.prototype.draw = function(context) {
  this.mGraph.draw(context);

  context.fillStyle = '#fff';
  var world = this,
      graphColumnWidth = world.mGraph.mColumnWidth,
      graphRowHeight = world.mGraph.mRowHeight;

  this.mLiving.forEach(function(cell) {
    console.log(cell);

    // convert cell coordinates to screen coordinates
    var x = cell.mX * graphColumnWidth,
        y = cell.mY * graphRowHeight;

    context.fillRect(x, y, world.mCellWidth, world.mCellHeight);  
  });
};

exports.World = World;
