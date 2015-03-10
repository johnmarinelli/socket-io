var Cell = require('./Cell.js').Cell;
var HashTable = require('./HashTable.js').HashTable;

function World(graph) {
  // physical representation of graph
  this.mGraph = graph;

  // standard 2d array
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
}

World.prototype.addCell = function(x, y, alive) {
  alive = alive || false;

  if (x > this.mGraph.mCols || y > this.mGraph.mRows) {
    throw 'Coordinates out of range';
  }

  var c = new Cell(x, y, alive);
  this.mCells[y][x] = c;

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
  this.mLiving.remove(cell);
  this.mDead.insert(cell)
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
