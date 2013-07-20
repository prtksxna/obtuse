var express = require('express');
var http = require('http');
var socket_io = require('socket.io');

var random_string = require('./random_string');


// Create the web server and the socket.io server.
var app = express();
var server = http.createServer(app);
var io = socket_io.listen(server);
server.listen(4242);


// Currently active games.
var ACTIVE_GAMES = {};


// Route for homepage.
app.get('/', function(req, res) {
  var gameId;
  do {
    gameId = random_string.random_string(8);  
  } while (gameId in ACTIVE_GAMES);
  
  ACTIVE_GAMES[gameId] = {};
  res.redirect('/' + gameId);
});


// Route for game page.
app.get('/:gameId', function(req, res) {
  res.sendfile(__dirname + '/static/game/index.html');
});


// Route for controller page.
app.get('/c/:gameId', function(req, res) {
  res.sendfile(__dirname + '/static/controller/index.html');
});


io.sockets.on('connection', function (socket) {
  socket.on('gameId game', function(gameId) {
    socket.join(gameId);
  });

  socket.on('gameId client', function(gameId) {
    socket.join(gameId);
  });

  socket.on('moveleft', function(gameId) {
    io.sockets.in(gameId).emit('moveleft');
  });
});