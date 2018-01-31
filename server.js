//
// # SimpleServer
//

// == or === (difference in type and value)
// var testModule = require("./additional");
// testModule.printSomething();
// testModule.printAvatar();



var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var fs = require("fs");

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);
var room1 = [];
var room2 = [];
var connections = [];
var generated ='';
var rooms = ['room1','room2']

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});


app.get('/1', function(req, res){ 
  res.sendfile(__dirname + '/index.html');
});


app.get('/', function(req, res){ 
  res.sendfile(__dirname + '/index.html');
});

/////////////////////////////

// var i;
// var count = 0;
// require('fs').createReadStream(__dirname + '/database.txt')
//   .on('data', function(chunk) {
//     for (i=0; i < chunk.length; ++i)
//       if (chunk[i] == 10) count++;
//   })
//   .on('end', function() {
//     console.log(count);
//   });

//////////////////////////


///////////////////////////
io.sockets.on('connection',function(socket){
  connections.push(socket);
  console.log('Connected users:' + connections.length);
  
  socket.on('disconnect', function(data){
    socket.leave(socket.room);
    if (socket.room == 'room1'){
      room1.splice(socket.room.indexOf(socket.username),1);
      updateUsernames(socket.room, room1);
    }else if (socket.room == 'room2'){
      room2.splice(socket.room.indexOf(socket.username),1);
      updateUsernames(socket.room, room2);
    }
    
    
    connections.splice(connections.indexOf(socket),1);
    console.log('-1 client');
  });
  
  socket.on('message', function(data){
    if(data){
    io.sockets.in(socket.room).emit('new message', {msg: data, user: socket.username});
    // io.sockets.emit('new message', {msg: data, user: socket.username});
    console.log("sent");
    }
  });
  

  socket.on('generate', function(){
    var number = Math.floor((Math.random() * 166) + 1);;
    console.log(number);
    generateWord(number);
  });
  
  //new user
  
  socket.on('new user', function(data,callback){
    callback(true);
    socket.username = data;
  });
  
  
  //add to room 
    
  socket.on('enter', function(data){
      socket.room='room'+data;
      socket.join('room'+data);
    if(data == 1){
      room2.push(socket.username);
      updateUsernames(socket.room, room2);
    }else if (data == 2){
    room1.push(socket.username);
    updateUsernames(socket.room, room1);
    }
  });

  function updateUsernames(room, listRooms){
     io.sockets.in(room).emit('get users', listRooms);
  };
  
  function generateWord(number){
    var cntr = 0;
    var fs = require('fs'),
        readline = require('readline');
    
    var rd = readline.createInterface({
        input: fs.createReadStream(__dirname + '/database.txt'),
    
    });
    
    rd.on('line', function(line) {
        if (cntr == number) {
            // only output lines starting with the 100th line
            generated = line;
            io.sockets.in(socket.room).emit('new message', {msg: generated, user: socket.username});
            console.log("generated");
        }
        cntr++;
    });
  };
});

 

