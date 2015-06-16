/*global gameUrls*/
var createNewGameButton;
var existingGamesList;
var webSocket;
var statusDiv;
var statusGameDiv;
var myGameId;
var myPlayerId;
var fieldDiv;
var startGameDiv;
var mainGameDiv;
var newGameButton;
var gameInProgress = false;
var side;
var enemySide;
var cellList = [];

var states =
{
waitActionState: 'waitActionState',
gameEndedState: 'gameEndedState',
errorNewGameState: 'errorNewGameState',
creatingNewGameState: 'creatingNewGameState',
gameReadyErrorState: 'gameReadyErrorState',
gameStartedState: 'gameStartedState',
moveErrorState: 'moveErrorState'
};

function showStatusMessage(message) {
  'use strict';
  statusDiv.style.display = 'block';
  statusDiv.innerHTML = message;
  statusGameDiv.innerHTML = message;
}

function changeState(newState) {
  'use strict';
  switch (newState) {
  case states.waitActionState:
    {
      startGameDiv.removeAttribute('style');
      mainGameDiv.removeAttribute('style');
      createNewGameButton.disabled = false;
      gameInProgress = false;
      showStatusMessage('');
      break;
    }
  case states.gameEndedState:
    {
      gameInProgress = false;
      newGameButton.innerHTML = 'Новая игра';
      break;
    }
  case states.errorNewGameState:
    {
      showStatusMessage('Ошибка создания игры');
      createNewGameButton.disabled = false;
      break;
    }
  case states.creatingNewGameState:
    {
      showStatusMessage('Ожидаем начала игры');
      createNewGameButton.disabled = true;
      break;
    }
  case states.gameReadyErrorState:
    {
      myGameId = null;
      myPlayerId = null;
      createNewGameButton.disabled = false;
      gameInProgress = false;
      break;
    }
  case states.gameStartedState:
    {
      newGameButton.innerHTML = 'Сдаться';
      gameInProgress = true;
      startGameDiv.style.display = 'none';
      mainGameDiv.style.display = 'block';
      break;
    }
  case states.moveErrorState:
    {
      gameInProgress = false;
      newGameButton.innerHTML = 'Новая игра';
      break;
    }
  default :
    {
      break;
    }
  }
}

function endGame(message) {
  'use strict';
  showStatusMessage(message);
  changeState(states.gameEndedState);
}

function registerOnGame(gameId) {
  'use strict';
  myGameId = gameId;
  webSocket.send(JSON.stringify({register: gameId}));
}

function onClickOnGame(e) {
  'use strict';
  var gameId = e.target.dataset.id;
  registerOnGame(gameId);
}

// region GameProcess

function getCellById(cellId) {
  'use strict';
  var j;
  var cell;

  for (j = 0; j < cellList.length; j++) {
    cell = cellList[j];

    if (cell.dataset.id === cellId.toString()) {
      return cell;
    }
  }
}

function markCell(cellId, currentMove) {
  'use strict';
  var cell = getCellById(cellId);
  cell.classList.add(currentMove);
}

function waitMove() {
  'use strict';
  var moveRequest;

  if (!gameInProgress) {
    return;
  }

  moveRequest = new XMLHttpRequest();
  moveRequest.open('GET', gameUrls.move);
  moveRequest.setRequestHeader('Game-ID', myGameId.toString());
  moveRequest.setRequestHeader('Player-ID', myPlayerId.toString());
  moveRequest.setRequestHeader('Content-Type', 'application/json');

  try {
    moveRequest.send();
  } catch (e) {
    waitMove();
  }

  moveRequest.addEventListener('load', function onLoad() {
    var data;
    if (moveRequest.status !== 200) {
      showStatusMessage(moveRequest.status);
      waitMove();
      return;
    }

    data = JSON.parse(moveRequest.responseText);

    if (data.move !== undefined && data.move !== null) {
      markCell(data.move, enemySide);
    }

    if (data.win !== undefined) {
      endGame(data.win);
    }
  });
}

function makeMove(cellId) {
  'use strict';
  var moveRequest;

  if (!gameInProgress) {
    return;
  }

  moveRequest = new XMLHttpRequest();
  moveRequest.open('POST', gameUrls.move);
  moveRequest.setRequestHeader('Game-ID', myGameId.toString());
  moveRequest.setRequestHeader('Player-ID', myPlayerId.toString());
  moveRequest.setRequestHeader('Content-Type', 'application/json');
  try {
    moveRequest.send(JSON.stringify({move: cellId}));
  } catch(e) {
    changeState(states.moveErrorState);
  }

  moveRequest.addEventListener('load', function onLoad() {
    var data = JSON.parse(moveRequest.responseText);
    if (moveRequest.status !== 200) {
      if (data.message !== undefined && data.message !== null) {
        showStatusMessage(data.message);
        waitMove();
      } else {
        if (data.win !== undefined && data.win !== null) {
          endGame(data.win);
          return;
        }
        showStatusMessage('Неизвестная ошибка');
        changeState(states.moveErrorState);
      }
      return;
    }

    markCell(cellId, side);

    if (data !== null) {
      if (data.win !== undefined) {
        endGame(data.win);
        return;
      }
    }

    waitMove();
  });
}

function onCellClicked(e) {
  'use strict';
  var cell = e.target;

  // There is no need to do anything if the game is over or cell is not empty
  if (cell.classList.contains('x') || cell.classList.contains('o') || !cell.classList.contains('cell')) {
    return;
  }

  makeMove(cell.dataset.id);
}

function buildFieldDiv(size) {
  'use strict';
  var i;
  var j;
  var cell;
  var rowDiv;

  fieldDiv.innerHTML = '';
  cellList = [];

  for (j = 0; j < size; j++) {
    rowDiv = document.createElement('div');
    rowDiv.classList.add('row');

    for (i = 1; i < size + 1; i++) {
      cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.id = j * 10 + i;
      rowDiv.appendChild(cell);
      cellList.push(cell);
    }

    fieldDiv.appendChild(rowDiv);
  }
}

function showGame() {
  'use strict';
  changeState(states.gameStartedState);
  buildFieldDiv(10);
  waitMove();
}

// endregion

// region WebSocketMessages
function addGame(gameInfo) {
  'use strict';
  var newElementList;
  newElementList = document.createElement('li');
  newElementList.innerHTML = gameInfo.id;
  newElementList.dataset.id = gameInfo.id;
  existingGamesList.insertBefore(newElementList, existingGamesList.childNodes[0]);
  newElementList.addEventListener('click', onClickOnGame);
  // var id = gameInfo.id;
  // setTimeout(function(){registerOnGame(id);},1000);
}

function removeGame(gameInfo) {
  'use strict';
  var allElements = document.querySelectorAll('li');
  var i;
  for (i = 0; i < allElements.length; i++) {
    if (allElements[i].dataset.id === gameInfo.id) {
      existingGamesList.removeChild(allElements[i]);
      return;
    }
  }
}

function beginGame(gameInfo) {
  'use strict';
  var startGameRequest;
  var dataToSend;
  myPlayerId = gameInfo.id;
  showStatusMessage('Ожидаем начала игры');
  createNewGameButton.disabled = true;
  startGameRequest = new XMLHttpRequest();
  startGameRequest.open('POST', gameUrls.gameReady);
  startGameRequest.setRequestHeader('Content-Type', 'application/json');
  dataToSend = JSON.stringify({player: myPlayerId, game: myGameId});

  try {
    startGameRequest.send(dataToSend);
  } catch (e) {
    changeState(states.gameReadyErrorState);
  }

  startGameRequest.addEventListener('load', function onLoad() {
    if (startGameRequest.status === 410) {
      showStatusMessage('Ошибка старта игры: другой игрок не ответил');
      changeState(states.gameReadyErrorState);
      return;
    }

    if (startGameRequest.status !== 200) {
      showStatusMessage('Неизвестная ошибка старта игры');
      changeState(states.gameReadyErrorState);
      return;
    }

    side = JSON.parse(startGameRequest.responseText).side;
    showStatusMessage('Вы ходите ' + side);
    enemySide = side === 'x' ? 'o' : 'x';
    showGame();
  });
}

function connectWebSocket() {
  'use strict';
  var url = gameUrls.list;
  webSocket = new WebSocket(url);
  webSocket.addEventListener('message', function onMessage(event) {
    var data = JSON.parse(event.data);

    switch (data.action) {
    case 'add':
      {
        addGame(data);
        break;
      }

    case 'remove':
      {
        removeGame(data);
        break;
      }

    case 'startGame':
      {
        beginGame(data);
        break;
      }

    default:
      {
        showStatusMessage(data.error);
        break;
      }
    }
  });
}
// endregion

function onCreateNewGame() {
  'use strict';
  var idRequest;
  changeState(states.creatingNewGameState);
  try {
    idRequest = new XMLHttpRequest();
    idRequest.open('POST', gameUrls.newGame);
    idRequest.send();
  } catch (e) {
    changeState(states.errorNewGameState);
  }

  idRequest.addEventListener('load', function onLoad() {
    var data;
    if (idRequest.status === 200) {
      data = JSON.parse(idRequest.responseText);
      if (data !== null && data.yourId !== undefined && data.yourId !== null) {
        registerOnGame(data.yourId);
        return;
      }
    }
    changeState(states.errorNewGameState);
  });
}

function onNewGameClicked() {
  'use strict';
  var surrenderRequest;

  changeState(states.waitActionState);
  surrenderRequest = new XMLHttpRequest();
  surrenderRequest.open('PUT', gameUrls.surrender);
  surrenderRequest.setRequestHeader('Game-ID', myGameId.toString());
  surrenderRequest.setRequestHeader('Player-ID', myPlayerId.toString());
  surrenderRequest.send();

  gameInProgress = false;

  surrenderRequest.addEventListener('load', function onSurrender() {
    if (surrenderRequest.status === 200) {
      changeState(states.waitActionState);
    } else {
      showStatusMessage(surrenderRequest.status + surrenderRequest.statusText);
    }
  });
}

window.addEventListener('load', function onLoad() {
  'use strict';
  connectWebSocket();
  createNewGameButton = document.querySelector('.createGame');
  createNewGameButton.addEventListener('click', onCreateNewGame);

  existingGamesList = document.querySelector('.existing-games');
  statusDiv = document.querySelectorAll('.status-message')[0];
  statusGameDiv = document.querySelectorAll('.status-message')[1];
  fieldDiv = document.querySelector('.field');
  startGameDiv = document.querySelector('.startGame');
  mainGameDiv = document.querySelector('.mainGame');

  fieldDiv.addEventListener('click', onCellClicked);

  newGameButton = document.querySelector('.newGame');
  newGameButton.addEventListener('click', onNewGameClicked);
});
