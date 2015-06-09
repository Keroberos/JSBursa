/*global getWinner */

var fieldSizeInput;
var errorDiv;
var startMenuDiv;
var fieldDiv;
var winnerMessageDiv;
var mainGame;
var cellList;

var model =
{
  fieldSize: 0,
  cellList: [],
  gameStatus: 'notStarted',
  lastTurn: 'o',
  winnerMessage: ''
};

function getModelCell(x, y) {
  'use strict';
  var j;
  var cell;
  var cellX;
  var cellY;

  for (j = 0; j < model.cellList.length; j++) {
    cell = model.cellList[j];
    cellX = cell.x;
    cellY = cell.y;

    if (cellX === x && cellY === y) {
      return cell;
    }
  }
}

function saveGame() {
  'use strict';
  var data = JSON.stringify(model);
  localStorage.setItem('game', data);
}

function restoreCells() {
  'use strict';
  var i;
  var cell;
  var modelValue;

  for (i = 0; i < cellList.length; i++) {
    cell = cellList[i];
    modelValue = getModelCell(cell.getAttribute('x'), cell.getAttribute('y')).value;
    if (modelValue !== '') {
      cell.classList.add(modelValue);
    }
  }
}

// Shows winner message
function showWinnerMessage(message) {
  'use strict';
  winnerMessageDiv.innerHTML = message;
}

function endGame(message) {
  'use strict';
  showWinnerMessage(message);
  model.gameStatus = 'gameEnded';
  model.winnerMessage = message;
}

// Checks conditions for the game over
function checkEndGame() {
  'use strict';
  var result = getWinner();
  var i;
  var cellClassList;

  if (result === 'o') {
    endGame('Нолик победил');
  }

  if (result === 'x') {
    endGame('Крестик победил');
  }

  for (i = 0; i < cellList.length; i++) {
    cellClassList = cellList[i].classList;
    if (!cellClassList.contains('x') && !cellClassList.contains('o')) {
      return;
    }
  }

  endGame('Ничья'); // Calls if all cell are not empty
}

function isInteger(obj) {
  'use strict';
  return !isNaN(obj) && (typeof obj === 'number') && (obj % 1 === 0);
}

function buildFieldDiv() {
  'use strict';
  var i;
  var j;
  var cell;
  var rowDiv;

  fieldDiv.innerHTML = '';
  cellList = [];

  for (j = 0; j < model.fieldSize; j++) {
    rowDiv = document.createElement('div');
    rowDiv.classList.add('row');

    for (i = 0; i < model.fieldSize; i++) {
      cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('x', i.toString());
      cell.setAttribute('y', j.toString());
      rowDiv.appendChild(cell);
      cellList.push(cell);
      model.cellList.push({x: i.toString(), y: j.toString(), value: ''});
    }

    fieldDiv.appendChild(rowDiv);
  }

  return rowDiv;
}

function changeState() {
  'use strict';
  switch (model.gameStatus) {
    case 'gameStarted':
    case 'gameEnded':
    {
      startMenuDiv.style.display = 'none';
      mainGame.style.display = 'block';
      buildFieldDiv();
      restoreCells();
      showWinnerMessage(model.winnerMessage);
      break;
    }
    case 'notStarted':
    {
      fieldSizeInput.value = '';
      model.cellList = [];
      model.lastTurn = 'o';
      model.cellList = [];
      model.winnerMessage = '';

      startMenuDiv.style.display = 'block';
      mainGame.style.display = 'none';
      break;
    }

    default:
    {
      break;
    }
  }
  saveGame();
}

function onGenerateFieldButton() {
  'use strict';
  var fieldSize = +fieldSizeInput.value;

  if (!isInteger(fieldSize) || fieldSize < 5 || fieldSize > 15) {
    errorDiv.innerHTML = 'Вы ввели некорректное число';
    return;
  }

  errorDiv.innerHTML = '';

  model.gameStatus = 'gameStarted';
  model.fieldSize = fieldSize;

  buildFieldDiv(fieldSize);
  changeState();
}

function onCellClicked(e) {
  'use strict';
  var currentTurn;
  var cell = e.target;
  var cellModel;

  // There is no need to do anything if the game is over or cell is not empty
  if (model.gameStatus !== 'gameStarted' || cell.classList.contains('x') || cell.classList.contains('o') || !cell.classList.contains('cell')) {
    return;
  }

  // define current turn according to last turn
  if (model.lastTurn === 'o') {
    currentTurn = 'x';
  } else {
    currentTurn = 'o';
  }

  // Make turn and save it as last turn
  cell.classList.add(currentTurn);
  model.lastTurn = currentTurn;

  cellModel = getModelCell(cell.getAttribute('x'), cell.getAttribute('y'));
  cellModel.value = currentTurn;

  checkEndGame();
  saveGame();
}

function onStartNewGameButton() {
  'use strict';
  model.gameStatus = 'notStarted';
  changeState();
}

function loadGame() {
  'use strict';
  var data = localStorage.getItem('game');
  if (data !== null) {
    model = JSON.parse(data);
    changeState();
  }
}

function onLoad() {
  'use strict';
  var generateFieldButton = document.querySelector('.generateField');
  var startNewGameButton = document.querySelector('.startNewGame');
  generateFieldButton.addEventListener('click', onGenerateFieldButton);
  startNewGameButton.addEventListener('click', onStartNewGameButton);

  fieldSizeInput = document.querySelector('.count');
  errorDiv = document.querySelector('.error-message');

  startMenuDiv = document.querySelector('.startGame');
  fieldDiv = document.querySelector('.field');
  winnerMessageDiv = document.querySelector('.winner-message');
  mainGame = document.querySelector('.mainGame');
  fieldDiv.addEventListener('click', onCellClicked);

  cellList = [];

  loadGame();
}

window.addEventListener('load', onLoad);
