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
  
  // hash table for living cells
  this.mLiving = new HashTable(function(x,y) {
    return (x ^ (y << 1) >> 1);
  });
  
  // hash table for dead cells
  this.mDead = new HashTable(function(x,y) {
    return (x ^ (y << 1) >> 1);
  });
}

World.prototype.addCell = function(x, y, alive) {
  alive = alive || false;
  var c = new Cell(x, y, alive);
  this.mCells[y][x] = c;

  if (alive) this.mLiving.insert(c);
  else this.mDead.insert(c);
};

World.prototype.getCell = function(x, y) {
  return this.mCells[y][x];
};

exports.World = World;
