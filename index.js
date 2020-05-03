var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/router');
app.use('/', routes);
//app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


let player=[];

io.on('connection', function(socket){

  socket.on('player', (name,color,server) =>{
    socket.join(server)
    io.to(server).emit('new', socket.id,name,color);
    player.forEach( element => {
      if(element.socket.server == server)
        socket.emit('new', element.socket.id,element.name,element.color)
    })
    socket.server=server
    player.push({socket:socket,name:name,color:color})
  })

  socket.on('move', function(x,z,r_y,room){
      socket.broadcast.to(socket.rooms[socket.server]).emit('move', socket.id,x,z,r_y);
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



