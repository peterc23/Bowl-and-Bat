var app = require('express').createServer(),
    gameroomEvents = require('./resources/gameroomEvents.js'),
    io = require('socket.io').listen(app);

app.listen(3000);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/client/index.html');
});
// usernames which are currently connected to the game
var usernames = {};
// rooms which are currently available in game
var rooms = ['room1','room2','room3'];

var gameroom = io
    .of('/gameroom')
    .on('connection', function (socket) {

        socket.emit(gameroomEvents.GAME_ROOM_STATUS, { availableRooms: rooms.length, gameRooms :rooms
        });
        //******************** PLAYER JOINED THE GAME/ROOM*****************8888
        socket.on(gameroomEvents.GAME_JOIN, function(message){
            if(rooms[message.gameroom].players > 2 ){
                socket.emit(gameroomEvents.GAME_JOIN_FAILED, {status: 'full'});
            }else{
            // store the username in the socket session for this client
            socket.username = message.username;
            // store the room name in the socket session for this client
            socket.room = message.gameroom;
            // send client to room 1
            socket.join(message.gameroom);
            rooms[message.gameroom].players = rooms[message.gameroom].players + 1;
            // echo to client they've connected
            // echo to room 1 that a person has connected to their room
            socket.broadcast.to(message.gameroom).emit(gameroomEvents.GAME_PLAYER_UPDATE,
                {username: message.username, room: message.gameroom, status: gameroomEvents.GAME_PLAYER_JOINED});
            }
        });
        //******************BATTER MADE A MOVE *****************8
        socket.on(gameroomEvents.GAME_MOVE_BATTER, function(message){
            io.sockets.in(socket.room).emit(gameroomEvents.GAME_MOVE_BATTER, message);
        });
        //********** BOWLER MADE A MOVE ***********************
        socket.on(gameroomEvents.GAME_MOVE_BOWLER, function(message){
            io.sockets.in(socket.room).emit(gameroomEvents.GAME_MOVE_BOWLER, message);
        });

        //***********************PLAYER DISCONNECT EVENT**************
        socket.on(gameroomEvents.GAME_DISCONNECT, function(){
            // remove the username from global usernames list
            delete usernames[socket.username];
            // update list of users in chat, client-side
            io.sockets.emit(gameroomEvents.GAME_DISCONNECT, socket.username);
            rooms[socket.room].players = rooms[socket.room].players - 1;
            // echo globally that this client has left
            socket.broadcast.to(socket.room).emit(gameroomEvents.GAME_PLAYER_UPDATE, {username: socket.username, room: socket.gameroom, status: gameroomEvents.GAME_PLAYER_LEFT});
            socket.leave(socket.room);
        });

    });


var lobby = io
    .of('/lobby')
    .on('connection', function (socket) {
        socket.emit('', { news: 'item' });
    });