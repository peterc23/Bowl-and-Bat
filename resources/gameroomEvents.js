(function(exports){
    //this file specifies all the shared events between all the files.
    exports.SERVER_URL = 'http://192.168.1.8:1234';
    exports.GAME_ROOM_URL = '/gameroom';

    //****General Game Functions
    exports.GAME_JOIN = 'GAME_JOIN';
    exports.GAME_ROOM_STATUS = 'GAME_ROOM_STATUS';
    exports.GAME_JOIN_FAILED = 'GAME_JOIN_FAILED';
    exports.GAME_STATUS_UPDATE = 'GAME_STATUS_UPDATE';
    exports.GAME_PLAYER_UPDATE = 'GAME_PLAYER_UPDATE';
        exports.GAME_PLAYER_JOINED = 'GAME_PLAYER_JOINED';
        exports.GAME_PLAYER_LEFT = 'GAME_PLAYER_LEFT';
    exports.GAME_DISCONNECT = 'GAME_DISCONNECT';

    //****Game Move Event
    exports.GAME_MOVE_BOWLER = 'GAME_MOVE_BOWLER';
    exports.GAME_MOVE_BATTER = 'GAME_MOVE_BATTER';


})(typeof exports === 'undefined'? this['gameroomEvents']={}: exports);