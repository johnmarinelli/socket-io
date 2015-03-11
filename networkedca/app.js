var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    World = require('./World.js').World,
    Graph = require('./Graph.js').Graph;

var clients = {};

// Seed world
var world = new World(new Graph(100, 100, 1000, 1000));
(function(world) {
  world.addCell(50, 50, true);
  world.addCell(50, 49, true);
  world.addCell(50, 51, true);
  world.addCell(49, 50, true);
  world.addCell(51, 49, true);
}(world));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  clients[socket.id] = socket;
  
  // On connection, give client information for drawing graph
  io.emit('graph dimensions', world.mGraph); 

  // clientside sends coordinates
  socket.on('send coords', function(coords) {
    // room wide broadcast coords
    io.emit('receive coords', coords, socket.id);
  });
});

http.listen(3000, function() {
  // Start world on the server side
  setInterval(function() {
  console.log(world.mLiving.mSize);
    world.update();
    io.emit('live cells', world.getLiveCells());
  }, 500);
  console.log('Listening on 3000');
});
