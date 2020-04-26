var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static('images'))
app.use(express.static('js'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('instantiateCard', function(data){
	  
    socket.broadcast.emit('instantiateCard',  { nodeID: data.nodeID, 
	                              cardKey: data.cardKey  });
  });
  
  socket.on('dragKnode', function(data){
	
    socket.broadcast.emit('dragKnode',  { nodeID: data.nodeID,
								x: data.x,
								y: data.y});
  });
  
  socket.on('rollDice', function(data){
	
    socket.broadcast.emit('rollDice',  data);
  });
  
  socket.on('toggleDieReroll', function(data){
	
    socket.broadcast.emit('toggleDieReroll',  data);
  });
  
  socket.on('settextval', function(data){
 
	socket.broadcast.emit('settextval',  data);
  });

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
