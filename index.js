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
    console.log('Join on server'+server)
    io.to(server).emit('cl', 'you join '+server)
    io.to(server).emit('new', socket.id,name,color);
    player.forEach( element => {
      socket.to(element.server).emit('new', element.socket.id,element.name,element.color)
    })
    player.push({socket:socket,name:name,color:color,server:server})
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



