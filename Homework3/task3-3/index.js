var createNewGameButton;
var W0;

function connectWebSocket() {
    var url = gameUrls.list;    
    W0 = new WebSocket(url);
    W0.onmessage = function (event) {
        console.log(event.data);
    }

    W0.onreadystatechange = function (event) {
        console.log(event.data);
    }
}

function onCreateNewGame() {
    W0.send('Hello');
}

window.addEventListener('load', function onLoad() {
    'use strict';
    connectWebSocket();
    createNewGameButton = document.querySelector('.createGame');
    createNewGameButton.addEventListener('click', onCreateNewGame);

});



