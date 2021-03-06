
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var io = require('socket.io');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var players = [1,2,3,4]; 
players.sort(function() {
  return 0.5 - Math.random();
});

var runner = [0,0,0,0];
var winner = null;

var socket = io.listen(server);
socket.on('connection', function(client) {
  var player = null;

  if ( players.length > 0 ) {
    player = players.shift();
    client.emit('setPlayer', player);
    client.broadcast.emit('addPlayer', player);
  }

  for (var i = 1; i <= 4; i++) {
    if ( players.indexOf(i) < 0 && i!=player) {
      client.emit('addPlayer', i);
    }
  };

  if ( winner > 0 ) {
    client.emit('sethWinner', winner);
  }

  client.on('disconnect', function(){
    runner[player-1] = 0;
    players.push(player);
    client.broadcast.emit('delPlayer', player);
  });

  client.on('run', function(){
    if ( runner[player-1] < 100 ) {
      runner[player-1] += 1;
    }else if( winner < 1 ) {
      winner = player;
      socket.sockets.emit('setWinner', winner);
      setTimeout( function () {
        runner = [0,0,0,0];
        winner = null;
        socket.sockets.emit('restart', winner);
      }, 10000);
    }
  });
});

(broadcastRunner = function(){
  socket.sockets.emit('runner', runner);
  setTimeout(broadcastRunner, 1000);
})();