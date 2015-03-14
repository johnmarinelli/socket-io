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

  // hashmap for storing cells to flip between updates 
  // when user clicks on canvas
  this.mCellsToFlip = new HashTable(hasher);

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
    
    // start at top left corner and move row by row
    // counting the cells that are alive
    // ignore the middle cell bcause that's simply
    // the cell that's checking for neighbors
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

// TODO:
// remove this and replace any intializing code with call to reviveCell()
World.prototype.addCell = function(x, y, alive) {
  alive = alive || false;

  if (x > this.mGraph.mCols || y > this.mGraph.mRows) {
    throw 'Coordinates out of range';
  }
  
  if (alive) this.reviveCell(x, y);
};

// return cell. column major
World.prototype.getCell = function(x, y) {
  return this.mCells[y][x];
};

// switch cell state to alive, switch containers
World.prototype.reviveCell = function(x, y) {
  var cell = this.mDead.get(x, y);
  if (!cell) {
    console.log('No cell at (' + x + ', ' + y + ')');
    return false;
  }
  this.mCells[y][x].mAlive = true;
  this.mLiving.insert(cell);
  this.mDead.remove(cell.mX, cell.mY);
};

// set cell state to dead, switch containers
World.prototype.killCell = function(x, y) {
  var cell = this.mLiving.get(x, y);
  if (!cell) {
    console.log('No cell at (' + x + ', ' + y + ')');
    return false;
  }
  this.mCells[y][x].mAlive = false;
  this.mLiving.remove(cell.mX, cell.mY);
  this.mDead.insert(cell);
};

// Adds cell to the 'flipping' stage, in between discrete timesteps
World.prototype.addCellToFlip = function(x, y) {
  if (!this.mCellsToFlip.hasElement(x, y)) {
  console.log(this.getCell(x,y));
    this.mCellsToFlip.insert(this.getCell(x,y));
  }
};

// called at end of update() on all the cells in mCellsToFlip
// flips cell state and its container
World.prototype.flipCell = function(x, y) {
  var cell = this.getCell(x, y);
  cell.mAlive ? this.killCell(x, y) : this.reviveCell(x, y);
};

// checks each cell against the rules.
// does user input at the very end.
// this isn't usually how a traditional event loop goes;
World.prototype.update = function() {
  var world = this,
      toDie = [],
      toLife = [],
      i = 0,
      c = null;

  this.mCellsToFlip.forEach(function(c) {
    var x = c.mX,
        y = c.mY;

    // since cells stored in mCellsToFlip preserve old state,
    // and we want to overwrite the new state,
    // we have to ask world for the cell again
    var cell = world.getCell(x, y);
    console.log('FLIPPING ' + cell.mAlive);
    cell.mAlive ? world.killCell(x, y) : world.reviveCell(x, y);
    cell.protect = true;
  });

  this.mCellsToFlip.clear(); 

  // store cells to be killed in separate array to preserve state
  // of cell during rule checking
  this.mLiving.forEach(function(cell) {
    var neighborCount = world.countNeighbors(cell.mX, cell.mY);
    if (neighborCount < 2) toDie.push(cell);
    if (neighborCount > 3) toDie.push(cell);
  });
  
  // store cells to be revived in separate array to preserve state
  // of cell during rule checking
  this.mDead.forEach(function(cell) {
    var neighborCount = world.countNeighbors(cell.mX, cell.mY);
    if (neighborCount === 3) toLife.push(cell);
  });

  // kill cell
  for (i = 0; i < toDie.length; ++i) {
    c = toDie[i];
    world.killCell(c.mX, c.mY);
  }
  
  // revive cell
  for (i = 0; i < toLife.length; ++i) {
    c = toLife[i];
    world.reviveCell(c.mX, c.mY);
  }
};

// function for clientside rendering
World.prototype.getLiveCells = function() {
  var live = [];

  this.mLiving.forEach(function(cell) {
    live.push([cell.mX, cell.mY]);
  });

  return live;
};

// not used much in server-client mode but helpful in debugging
World.prototype.draw = function(context) {
  var world = this,
      graphColumnWidth = world.mGraph.mColumnWidth,
      graphRowHeight = world.mGraph.mRowHeight;
  
  function paint(x_, y_) {
    // convert cell coordinates to screen coordinates
    var x = x_ * graphColumnWidth,
        y = y_ * graphRowHeight;
    context.fillRect(x, y, world.mCellWidth, world.mCellHeight);
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
