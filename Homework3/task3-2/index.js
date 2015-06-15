function call(methodName, label, callbackFunction) {
  'use strict';

  var result = false;
  var xhr = new XMLHttpRequest();
  try {
    xhr.open(methodName, 'http://cors-test.appspot.com/test');
    xhr.send();
  } catch (e) {
    callbackFunction(result, label);
  }

  xhr.addEventListener('readystatechange', function onStatusChanged() {
    var data;
    result = false;
    if (xhr.readyState !== xhr.DONE) {
      return;
    }
    if (xhr.status === 200) {
      data = JSON.parse(xhr.responseText);
      if (data !== null && data !== undefined && data.status === 'ok') {
        result = true;
      }
    }
    callbackFunction(result, label);
  });
}

function processReply(isOk, label) {
  'use strict';
  if (isOk) {
    label.innerHTML = 'OK';
    label.style.color = 'green';
    label.style.fontWeight = 'bold';
  } else {
    label.innerHTML = 'Failed';
    label.style.color = 'red';
    label.style.fontWeight = 'bold';
  }
}

window.addEventListener('load', function onLoad() {
  'use strict';

  var getLabel = document.querySelector('.get');
  var postLabel = document.querySelector('.post');
  var weirdLabel = document.querySelector('.weird');

  call('GET', getLabel, processReply);
  call('POST', postLabel, processReply);
  call('WEIRD', weirdLabel, processReply);
});
