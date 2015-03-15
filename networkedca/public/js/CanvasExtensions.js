// helper function to initialize some custom canvas functions
var CanvasExtensions = (function() {
  // helper function to calculate position of a click
  HTMLCanvasElement.prototype.getMouseCoords = function(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return [canvasX, canvasY];
  };

  HTMLCanvasElement.prototype.snapToGrid = function(coords, colWidth, rowHeight) {
      coords[0] -= (coords[0] % colWidth);
      coords[1] -= (coords[1] % rowHeight);

      return coords;
  };

  HTMLCanvasElement.prototype.getSnappedCoordinates = function(event, colWidth, rowHeight) {
    var coords = this.getMouseCoords(event);
    return this.snapToGrid(coords, colWidth, rowHeight);
  };
})();

