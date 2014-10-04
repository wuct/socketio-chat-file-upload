var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ss = require('socket.io-stream');
var path = require('path');
var fs = require('fs');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  // receive file
  ss(socket).on('file', function(stream, data) {
    console.log('receive a file', data);
    // var filename = path.basename(data.name);
    stream.pipe( fs.createWriteStream( path.join('./public/tmp/' + data.name) ));
    stream.on('end', function(){
      // console.log('file upload end');
      io.emit('new file', {
        name: data.name,
        size: data.size,
        url: '/tmp/' + data.name
      });
    });
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
