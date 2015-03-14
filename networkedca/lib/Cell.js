function Cell(x, y, alive) {
  this.mAlive = alive;
  this.mX = x;
  this.mY = y;
}

Cell.prototype.update = function(newData) {
  // have to do explicit checking instead of short circuting
  // because false || true = true
  this.mAlive = newData.alive !== undefined ? newData.alive : this.mAlive;
  this.mX = newData.x || this.mX;
  this.mY = newData.y || this.mY;
};

exports.Cell = Cell;
