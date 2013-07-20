var express = require('express');
var http = require('http');
var socket_io = require('socket.io');

var random_string = require('./random_string');


// Create the web server and the socket.io server.
var app = express();
var server = http.createServer(app);
var io = socket_io.listen(server);
server.listen(4242);


var ACTIVE_GAMES = {};


// Static files and assets.
app.use('/static', express.static(__dirname + '/static'));


// Route for homepage.
app.get('/', function(req, res) {
  var gameId;
  do {
    gameId = random_string.random_string(1);  
  } while (gameId in ACTIVE_GAMES);
  
  ACTIVE_GAMES[gameId] = {};
  res.redirect('/' + gameId);
});


// Route for game page.
app.get('/:gameId', function(req, res) {
  res.sendfile(__dirname + '/game.html');
});


// Route for controller page.
app.get('/c/:gameId', function(req, res) {
  res.sendfile(__dirname + '/controller.html');
});


io.sockets.on('connection', function (socket) {
  // TODO: prevent more than two players in a single game.
  socket.on('gameId game', function(gameId) {
    console.log('game loaded');
    socket.join(gameId);
  });

  socket.on('gameId client', function(gameId) {
    console.log('client joined');
    socket.join(gameId);
  });

  socket.on('moveleft', function(gameId) {
    console.log('move left');
    io.sockets.in(gameId).emit('moveleft');
  });

  socket.on('moveright', function(gameId) {
    console.log('move right');
    io.sockets.in(gameId).emit('moveright');
  });
});