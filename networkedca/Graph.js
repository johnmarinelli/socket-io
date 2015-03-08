function Graph(cols, rows, totalWidth, totalHeight) {
  cols = Math.abs(cols);
  rows = Math.abs(rows);
  totalWidth = Math.abs(totalWidth);
  totalHeight = Math.abs(totalHeight);

  this.mCols = cols;
  this.mRows = rows;

  this.mColumnWidth = totalWidth / cols;
  this.mRowHeight = totalHeight / rows;

  this.mWidth = totalWidth;
  this.mHeight = totalHeight;
  
  this.mNumCells = cols*rows;
}

Graph.prototype.shape = function() {
  return [this.mCols, this.mRows, this.mNumCells];
};

Graph.prototype.draw = function(ctx) {
  for (var x = 0; x <= this.mWidth; x += this.mColumnWidth) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, this.mHeight);
  }

  for (var y = 0; y <= this.mHeight; y += this.mRowHeight) {
    ctx.moveTo(0, y);
    ctx.lineTo(this.mWidth, y);
  }
  
  ctx.stroke();
};

exports.Graph = Graph;
