var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

var clients = {};

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  clients[socket.id] = socket;

  // clientside sends coordinates
  socket.on('send coords', function(coords) {
    // room wide broadcast coords
    io.emit('receive coords', coords, socket.id);
  });
});

http.listen(3000, function() {
  console.log('Listening on 3000');
});
