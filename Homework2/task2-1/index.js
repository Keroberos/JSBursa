var inputTextBox;
var list;

var taskList =
{
  items: []
};

function saveData() {
  var dataToSave = JSON.stringify(taskList);
  localStorage.setItem('tasks', dataToSave);
}

function addNewTask() {
  var newText = inputTextBox.value;
  if (newText != '') {
    taskList.items.push(newText);
    taskList.items.sort();
    render();
    inputTextBox.value = '';
    saveData();
  }

  inputTextBox.focus();
}
function onButtonClick() {
  addNewTask();
}

function render() {
  list.innerHTML = '';
  taskList.items.forEach(function (element) {
    var newElement = document.createElement('li');
    newElement.textContent = element;
    list.appendChild(newElement);
  })

}

function loadData() {
  var loadedData = localStorage.getItem('tasks');
  taskList = JSON.parse(loadedData);
  render();
}

function onKeyDown(e) {
  if (e.charCode == 13) {
    addNewTask();
  }
}

function onLoad() {
  var button = document.querySelector('button');
  inputTextBox = document.querySelector('input');
  list = document.querySelector('ul');
  button.addEventListener('click', onButtonClick);
  inputTextBox.addEventListener('keypress', onKeyDown);
  loadData();
}

window.addEventListener('load', onLoad);