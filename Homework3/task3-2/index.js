function call(methodName, label, callbackFunction) {
    'use strict';

    var result = false;
    var xhr = new XMLHttpRequest();
    try {
        xhr.open(methodName, 'https://cors-test.appspot.com/test');
        xhr.send();
    } catch (e) {
        callbackFunction(result, label);
    }

    xhr.addEventListener('readystatechange', function onStatusChanged(data) {
        'use strict';
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status == 200) {
                result = JSON.parse(xhr.responseText);
                if (result.status === 'ok') {
                    result = true;
                }
            }
            callbackFunction(result, label);
        }
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



