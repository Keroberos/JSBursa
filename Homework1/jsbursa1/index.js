/*global getWinner */

var lastTurn; // Gets the last turn - X or O
var gameIsEnd; // Indicate whether the game is over
var cellList; // Contains the list of cells

// Shows winner message
function showWinnerMessage(message) {
  'use strict';
  var winnerMessage = document.querySelector('.winner-message');
  winnerMessage.innerHTML = message;
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

// Clears cell
function clearCell(cell) {
  'use strict';
  cell.classList.remove('x');
  cell.classList.remove('o');
}

// Clears the field
function clearField() {
  'use strict';
  var i;
  for (i = 0; i < cellList.length; i++) {
    clearCell(cellList[i]);
  }

  showWinnerMessage(null);
}

// Start button click event handler
function onStartButtonClicked() {
  'use strict';
  gameIsEnd = false;
  lastTurn = 'o';
  clearField();
}

// Some cell click event handler
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

// Add necessary listeners
function subscribeOnEvents() {
  'use strict';
  var button = document.querySelector('.startNewGame');
  var field = document.querySelector('.field');

  button.addEventListener('click', onStartButtonClicked);
  field.addEventListener('click', onCellClicked);
}

// Execute when window loaded
function onWindowLoadHandler() {
  'use strict';
  cellList = document.querySelectorAll('.field .cell'); // select cells on the field
  subscribeOnEvents();
}

window.addEventListener('load', onWindowLoadHandler); // Execute code when window will be loaded
