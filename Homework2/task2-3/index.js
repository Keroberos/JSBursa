var fieldSizeInput;
var errorDiv;
var startMenuDiv;
var fieldDiv;
var winnerMessageDiv;
var mainGame;

var cellList; // Contains the list of cells

var model
{
}
;

// Shows winner message
function showWinnerMessage(message) {
  'use strict';
  winnerMessageDiv.innerHTML = message;
}

function endGame(message) {
  'use strict';
  showWinnerMessage(message);
  gameIsEnd = true;
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

function getRow(size) {
  'use strict';
  var i;
  var cell;
  var rowDiv = document.createElement('div');
  rowDiv.classList.add('row');

  for (i = 0; i < size; i++) {
    cell = document.createElement('div');
    cell.classList.add('cell');
    rowDiv.appendChild(cell);
    cellList.push(cell);
  }

  return rowDiv;
}

function onStartNewButton() {
  'use strict';
  var fieldSize = +fieldSizeInput.value;
  var i;

  if (!isInteger(fieldSize) || fieldSize < 5 || fieldSize > 15) {
    errorDiv.innerHTML = 'Вы ввели некорректное число';
    return;
  }

  errorDiv.innerHTML = '';
  startMenuDiv.style.display = 'none';
  mainGame.style.display = 'block';

  for (i = 0; i < fieldSize; i++) {
    fieldDiv.appendChild(getRow(fieldSize));
  }

  fieldDiv.addEventListener('click', onCellClicked);
}

function onCellClicked(e) {
  'use strict';
  var currentTurn;

  // There is no need to do anything if the game is over or cell is not empty
  if (gameIsEnd || e.target.classList.contains('x') || e.target.classList.contains('o') || !e.target.classList.contains('cell')) {
    return;
  }

  // define current turn according to last turn
  if (lastTurn === 'o') {
    currentTurn = 'x';
  } else {
    currentTurn = 'o';
  }

  // Make turn and save it as last turn
  e.target.classList.add(currentTurn);
  lastTurn = currentTurn;

  checkEndGame();
}

function onLoad() {
  'use strict';
  var startNewButton = document.querySelector('.generateField');
  startNewButton.addEventListener('click', onStartNewButton);

  fieldSizeInput = document.querySelector('.count');
  errorDiv = document.querySelector('.error-message');

  startMenuDiv = document.querySelector('.startGame');
  fieldDiv = document.querySelector('.field');
  winnerMessageDiv = document.querySelector('.winner-message');
  mainGame = document.querySelector('.mainGame');

  gameIsEnd = false;
  lastTurn = 'o';
  cellList = [];
}

window.addEventListener('load', onLoad);
