(function(exports){

    //****General Game Functions
    exports.PLAYER_JOINED = 'PLAYER_JOINED';
    exports.LOBBY_GAME_STATUS = 'LOBBY_GAME_STATUS';
    exports.LOBBY_JOIN_ERROR = 'LOBBY_JOIN_ERROR';
    exports.PLAYER_CONNECTED_LOBBY = 'PLAYER_IN_LOBBY';
    exports.LOBBY_SEND_CHAT = 'LOBBY_SEND_CHAT';
    exports.LOBBY_UPDATE_CHAT = 'LOBBY_UPDATE_CHAT';


    //****Game Move Event
    exports.GAME_MOVE_BOWLER = 'GAME_MOVE_BOWLER';
    exports.GAME_MOVE_BATTER = 'GAME_MOVE_BATTER';


})(typeof exports === 'undefined'? this['lobbyEvents']={}: exports);