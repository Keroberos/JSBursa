window.addEventListener('load', onWindowLoadHandler); // Execute code when window will be loaded
var lastTurn; // Gets the last turn - X or O
var endGame; // Indicate whether the game is over
var cellList; // Contains the list of cells

// Execute when window loaded
function onWindowLoadHandler() {
    cellList = document.querySelectorAll('.field .cell'); // select cells on the field
    SubscribeOnEvents();
}

// Add neccessary listeners
function SubscribeOnEvents() {
    var button = document.querySelector('.startNewGame');
    button.addEventListener('click', OnStartButtonClicked);

    var field = document.querySelector('.field');
    field.addEventListener('click', OnCellClicked);
}

// Start button click event handler
function OnStartButtonClicked() {
    endGame = false;
    lastTurn = 'o';
    ClearField();
}

// Some cell click event handler
function OnCellClicked(e) {
    // There is no need to do anything if the game is over or cell is not empty
    if (endGame || e.target.classList.contains('x') || e.target.classList.contains('o') || !e.target.classList.contains('cell')) {
        return;
    }

    var currentTurn;

    // define current turn according to last turn
    if (lastTurn === 'o') {
        currentTurn = 'x'
    }
    else {
        currentTurn = 'o'
    }

    // Make turn and save it as last turn
    e.target.classList.add(currentTurn);
    lastTurn = currentTurn;

    CheckEndGame();
}

// Checks conditions for the game over
function CheckEndGame() {
    var result = getWinner();
    
    if (result === 'o') {
        EndGame('Нолик победил');
    }

    if (result === 'x') {
        EndGame('Крестик победил');
    }

    for (i = 0; i < cellList.length; ++i) {
        var cellClassList = cellList[i].classList;
        if (!cellClassList.contains('x') && !cellClassList.contains('o')) {
            return;
        }
    }

    EndGame('Ничья'); // Calls if all cell are not empty
}

function EndGame(message) {
    ShowWinnerMessage(message);
    endGame = true;
}

// Shows winner message
function ShowWinnerMessage(message) {
    var winnerMessage = document.querySelector('.winner-message');
    winnerMessage.innerHTML = message;
}

// Clears the field
function ClearField() {
    for (i = 0; i < cellList.length; ++i) {
        ClearCell(cellList[i]);
    }

    ShowWinnerMessage(null);
}

// Clears cell
function ClearCell(cell) {
    cell.classList.remove('x','o');
}