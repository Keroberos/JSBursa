var firstInputTextBox;
var secondInputTextBox;
var body;

function onLoad() {
  body = document.querySelector('body');
  firstInputTextBox = document.createElement('input');
  secondInputTextBox = document.createElement('input');
  var calculateButton = document.createElement('button');
  calculateButton.innerHTML = 'Посчитать';
  calculateButton.onclick = onCalculate;

  body.appendChild(firstInputTextBox);
  body.appendChild(secondInputTextBox);
  body.appendChild(calculateButton);
}

function onCalculate() {
  var firstNumber = firstInputTextBox.value;
  if (isNaN(+firstNumber)) {
    var divError = document.createElement('div');
    divError.innerHTML='Это не число';
    body.insertBefore(divError,secondInputTextBox);
    return;
  }

  var divResult = document.createElement('div');
  divResult.id = 'result';
  divResult.innerHTML = '123';

  body.appendChild(divResult);

}

window.addEventListener('load', onLoad);