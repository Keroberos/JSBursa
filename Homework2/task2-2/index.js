var firstInputTextBox;
var secondInputTextBox;
var calculateButton;
var body;

function isNumeric(input) {
  'use strict';
  var RE = /^-{0,1}\d*\.{0,1}\d+$/;
  return (RE.test(input));
}

function getDivError() {
  'use strict';
  var divError = document.createElement('div');
  divError.classList.add('error-message');
  divError.innerHTML = 'Это не число';
  return divError;
}

function removeElement(elementSelector) {
  'use strict';
  var oldResult = document.querySelector(elementSelector);
  if (oldResult !== null) {
    body.removeChild(oldResult);
  }
}

function onCalculate() {
  'use strict';
  var firstNumber = +firstInputTextBox.value;
  var secondNumber = +secondInputTextBox.value;
  var hasError = false;
  var divResult;

  removeElement('#result');
  removeElement('.error-message');
  removeElement('.error-message');

  if (!isNumeric(firstInputTextBox.value)) {
    body.insertBefore(getDivError(), secondInputTextBox);
    hasError = true;
  }

  if (!isNumeric(secondInputTextBox.value)) {
    body.insertBefore(getDivError(), calculateButton);
    hasError = true;
  }

  if (!hasError) {
    divResult = document.createElement('div');
    divResult.id = 'result';
    divResult.innerHTML = firstNumber + secondNumber;

    body.appendChild(divResult);
  }
}

function onLoad() {
  'use strict';
  body = document.querySelector('body');

  firstInputTextBox = document.createElement('input');
  firstInputTextBox.style.display = 'block';
  secondInputTextBox = document.createElement('input');
  secondInputTextBox.style.display = 'block';
  calculateButton = document.createElement('button');

  calculateButton.innerHTML = 'Посчитать';
  calculateButton.onclick = onCalculate;

  body.appendChild(firstInputTextBox);
  body.appendChild(secondInputTextBox);
  body.appendChild(calculateButton);
}

window.addEventListener('load', onLoad);
