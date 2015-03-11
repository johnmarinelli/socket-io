var Cell = require('./Cell.js').Cell;
var HashTable = require('./HashTable.js').HashTable;

// 2d adjacency matrix (mCells) for quick neighbor counting & save space
// hashtables for actual manipulation of cells
function World(graph) {
  // physical representation of graph
  this.mGraph = graph;

  // 2d adjacency matrix
  this.mCells = [];
  
  function hasher(x, y) {
    return (x ^ (y << 1) >> 1);
  }
  
  // hash table for living cells
  this.mLiving = new HashTable(hasher); 
  
  // hash table for dead cells
  this.mDead = new HashTable(hasher);

  var height = graph.mRows,
      y = 0,
      width = graph.mCols,
      x;

  // initialize all cells as dead
  for ( ; y < height; ++y) {
    this.mCells[y] = [];
    for (x = 0; x < width; ++x) {
      var c = new Cell(x, y, false);
      this.mCells[y][x] = c;
      this.mDead.insert(c);
    }
  }

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
        if (undefined !== row && !(i === 1 && j === 1)) {
          var cell = row[x+j];
          if (undefined !== cell) {
            cell.mAlive ? neighborCount++ : 0;
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
  
  if (alive) this.reviveCell(x, y);
};

World.prototype.getCell = function(x, y) {
  return this.mCells[y][x];
};

World.prototype.reviveCell = function(x, y) {
  var cell = this.mDead.get(x, y);
  if (!cell) {
    console.log('No cell at (' + x + ', ' + y + ')');
    return false;
  }
  this.mCells[y][x].mAlive = true;
  this.mLiving.insert(cell);
  this.mDead.remove(cell.mX, cell.mY);
}

World.prototype.killCell = function(x, y) {
  var cell = this.mLiving.get(x, y);
  if (!cell) {
    console.log('No cell at (' + x + ', ' + y + ')');
    return false;
  }
  this.mCells[y][x].mAlive = false;
  this.mLiving.remove(cell.mX, cell.mY);
  this.mDead.insert(cell)
};

World.prototype.update = function() {
  var world = this,
      toDie = [],
      toLife = [];

  // store cells to be revived/killed in separate arrays,
  // then revive/kill them as necessary.
  // this is to preserve state of each cell during the algorithm
  this.mLiving.forEach(function(cell) {
    var neighborCount = world.countNeighbors(cell.mX, cell.mY);
    if (neighborCount < 2) toDie.push(cell);
    if (neighborCount > 3) toDie.push(cell);
  });
  
  this.mDead.forEach(function(cell) {
    var neighborCount = world.countNeighbors(cell.mX, cell.mY);
    if (neighborCount === 3) toLife.push(cell);
  });

  for (var i = 0; i < toDie.length; ++i) {
    var c = toDie[i]
    world.killCell(c.mX, c.mY);
  }
  
  for (var i = 0; i < toLife.length; ++i) {
    var c = toLife[i]
    world.reviveCell(c.mX, c.mY);
  }
};

World.prototype.getLiveCells = function() {
  var live = [];

  this.mLiving.forEach(function(cell) {
    live.push([cell.mX, cell.mY]);
  });

  return live;
};

World.prototype.draw = function(context) {
  var world = this,
      graphColumnWidth = world.mGraph.mColumnWidth,
      graphRowHeight = world.mGraph.mRowHeight;
  
  function paint(x_, y_) {
    // convert cell coordinates to screen coordinates
    var x = x_ * graphColumnWidth,
        y = y_ * graphRowHeight;
    context.fillRect(x, y, world.mCellWidth, world.mCellHeight)
  }

  // draw living cells in white
  context.fillStyle = '#fff';
  this.mLiving.forEach(function(cell) {
    paint(cell.mX, cell.mY);
  });

  // draw dead cells in black
  context.fillStyle = '#000';  
  this.mDead.forEach(function(cell) {
    paint(cell.mX, cell.mY);
  });
};

exports.World = World;
