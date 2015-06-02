var inputTextBox;
var list;

var taskList =
{
  items: []
};

function saveData() {
  'use strict';
  var dataToSave = JSON.stringify(taskList);
  localStorage.setItem('tasks', dataToSave);
}

function render() {
  'use strict';
  list.innerHTML = '';
  taskList.items.forEach(function creationLoop(element) {
    var newElement = document.createElement('li');
    newElement.textContent = element;
    list.appendChild(newElement);
  });
}

function addNewTask() {
  'use strict';
  var newText = inputTextBox.value;
  if (newText !== '') {
    taskList.items.push(newText);
    taskList.items.sort();
    render();
    inputTextBox.value = '';
    saveData();
  }

  inputTextBox.focus();
}
function onButtonClick() {
  'use strict';
  addNewTask();
}

function loadData() {
  'use strict';
  var loadedData = localStorage.getItem('tasks');
  var parsedData = JSON.parse(loadedData);

  if (parsedData !== null) {
    taskList = parsedData;
    render();
  }
}

function onKeyDown(e) {
  'use strict';
  if (+e.charCode === 13) {
    addNewTask();
  }
}

function onLoad() {
  'use strict';
  var button = document.querySelector('button');
  inputTextBox = document.querySelector('input');
  list = document.querySelector('ul');
  button.addEventListener('click', onButtonClick);
  inputTextBox.addEventListener('keypress', onKeyDown);
  loadData();
  inputTextBox.focus();
}

window.addEventListener('load', onLoad);
