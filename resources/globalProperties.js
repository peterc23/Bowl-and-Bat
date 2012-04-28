(function(exports){
    //this file specifies all the shared events between all the files.
    exports.SERVER_URL = 'http://localhost:3000';
    exports.GAME_ROOM_URL = '/gameroom';
    exports.LOBBY_URL = '/lobby';

})(typeof exports === 'undefined'? this['globalProperties']={}: exports);