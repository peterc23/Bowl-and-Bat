var app = require('express').createServer(),
    http = require('http');
    gameroomEvents = require('./resources/gameroomEvents.js'),
    lobbyEvents = require('./resources/lobbyEvents.js'),
    nodestatic = require('node-static'),
    socketio = require('socket.io');

var staticFiles = new(nodestatic.Server)('.');
var httpServer = http.createServer(function (request, response) {
    console.log("rahhh");
    request.addListener('end', function () {
        console.log("sigh");
        staticFiles.serve(request, response);
    });
}).listen(3000);

var io = socketio.listen(httpServer);
// usernames which are currently connected to the game
var usernames = {};
// rooms which are currently available in game
var roomnames = ['lobby','room1','room2','room3'];
var rooms = new Array(roomnames.length);
for(var i = 0; i < roomnames.length; i++){
    var room = {};
    room.name = roomnames[i];
    room.players = 0;
    rooms[i] = room;

    console.log(rooms);
}

var gameroom = io
    .of(gameroomEvents.GAME_ROOM_URL)
    .on('connection', function (socket) {

        socket.emit(gameroomEvents.GAME_ROOM_STATUS, { availableRooms: rooms.length, gameRooms :rooms
        });
        //******************** PLAYER JOINED THE GAME/ROOM*****************8888
        socket.on(gameroomEvents.GAME_JOIN, function(message){
            if(rooms[message.gameroom].players >= 2 ){
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
            socket.broadcast.to(socket.room).emit(gameroomEvents.GAME_PLAYER_UPDATE,
                {username: socket.username, room: socket.gameroom, status: gameroomEvents.GAME_PLAYER_LEFT});
            socket.leave(socket.room);
        });

    });


var lobby = io
    .of(lobbyEvents.LOBBY_URL)
    .on('connection', function (socket) {
        //socket.emit(lobbyEvents.LOBBY_GAME_STATUS, rooms);
        // when the client emits 'adduser', this listens and executes
        socket.on(lobbyEvents.PLAYER_JOINED, function(username){
            for (var i=0; i<usernames.length; i++){
                if(username == usernames[i].username){
                    socket.emit(lobbyEvents.LOBBY_JOIN_ERROR,{status: 'USERNAME_CONFLICT'})
                }else{
                }
            }
            // store the username in the socket session for this client
            socket.username = username;
            // store the room name in the socket session for this client
            socket.room = 'lobby';
            rooms[0].players ++;
            // add the client's username to the global list
            usernames[username] = username;
            // send client to room 1
            socket.join('lobby');
            socket.emit(lobbyEvents.LOBBY_GAME_STATUS, rooms);
        });


        // when the user disconnects.. perform this
        socket.on('disconnect', function(){
            // remove the username from global usernames list
            delete usernames[socket.username];
            rooms[0].players --;
            socket.emit(lobbyEvents.LOBBY_GAME_STATUS, rooms);
            socket.leave(socket.room);
        });
    });