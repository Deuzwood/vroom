var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


let player=[];

io.on('connection', function(socket){

  socket.on('player', (name,color) =>{
   
    io.emit('new', socket.id,name,color);

    player.forEach( element => {
      socket.emit('new', element.socket.id,element.name,element.color)
    })
    player.push({socket:socket,name:name,color:color})
  })

  socket.on('move', function(x,z,r_y){
      socket.broadcast.emit('move', socket.id,x,z,r_y);
  });


  socket.on('disconnect', function(){
      player.forEach( (element,i) => {
        if(element.socket == socket){
          player.splice(i,1);
          io.emit('remove', socket.id)
          return;
        }
      })
  })
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});



