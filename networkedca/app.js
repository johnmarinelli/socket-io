var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    World = require('./lib/World.js').World,
    Graph = require('./lib/Graph.js').Graph;

// configure express
app.use(express.static('public'));
app.use(express.static('views'));
console.log(app.get('env'));

var clients = {};

// Seed world
var graph = new Graph(100, 100, 1000, 1000);
var world = new World(graph);

(function(world) {
  world.addCell(50, 50, true);
  world.addCell(50, 49, true);
  world.addCell(50, 51, true);
  world.addCell(49, 50, true);
  world.addCell(51, 49, true);
}(world));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// ajax request from angular
app.get('drag_and_drop.html', function(req, res) {
  res.render('views/drag_and_drop.html');
});

io.on('connection', function(socket) {
  clients[socket.id] = socket;
  
  // On connection, give client information for drawing graph
  io.emit('graph dimensions', world.mGraph, socket.id);

  // clientside sends coordinates
  socket.on('send coords', function(coords) {
    // flip cell at coords
    coords[0] /= graph.mColumnWidth;
    coords[1] /= graph.mRowHeight;
    world.addCellToFlip(coords[0], coords[1]);

    // let room know who changed which coords
    io.emit('ack coords', coords, socket.id);
  });
});

http.listen(3000, function() {
  // Start world on the server side
  setInterval(function() {
  console.log(world.mLiving.mSize);
    world.update();
    io.emit('live cells', world.getLiveCells());
  }, 2000);
  console.log('Listening on 3000');
});
