var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

var id = 0;

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/users_online', function(req, res) {
  var names = [],
      clients = io.sockets.connected;

  for (var k in clients) {
    names.push(clients[k].nickname);
  }

  res.send(names);
});

io.on('connection', function(socket) {
  socket.nickname = 'user'+(id++);
  // change client side nickname 
  io.emit('change clientside nickname', socket.nickname);

  io.emit('display chat message', socket.nickname + ' has connected');

  // 'chat message' is emit()'ed from client side socket
  socket.on('chat message', function(msg) {
    // server side socket emits the same msg back to client
    io.emit('display chat message', socket.nickname + ': ' + msg);
  });

  // emit signal to client when user disconnects
  socket.on('disconnect', function() {
    console.log(socket.nickname + ' disconnected');
    io.emit('display chat message', 'A user has disconnected.');
  });

  // change server side nickname
  socket.on('nickname', function(nick) {
    var oldNick = socket.nickname || 'user';
    socket.nickname = nick;
    io.emit('display chat message', oldNick + ' has changed their nickname to ' + socket.nickname);

    // change client side nickname 
    io.emit('change clientside nickname', socket.nickname);
  });

  // this socket has focused the message box
  socket.on('user is typing', function(isTyping) {
    isTyping ? 
        io.emit('display is typing message', socket.nickname + ' is typing... ') :
        io.emit('display is typing message', false);
  });

  socket.on('pm', function(msg) {
    // find nickname in our users
    var clients = io.sockets.connected,
        pmTo = undefined;

    for (var k in clients) {
      if (clients[k].nickname === msg.to) pmTo = clients[k];
    }

    if (undefined !== pmTo) {
      pmTo.emit('pm', 'Message from ' + msg.from + ': ' + msg.body);
    }
  });
});

http.listen(3000, function() {
  console.log('listening on :3000');
});
