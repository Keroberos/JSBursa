var script;
var contentPresenter;

function callback(data) {
    contentPresenter.innerHTML = data.parse.text['*'];
}

function onClick() {
    var title = document.querySelector('input').value;

    if (script !== null && script !== undefined) {
        script.parentNode.removeChild(script);
    }

    script = document.createElement('script');
    document.head.appendChild(script);
    script.src = 'http://en.wikipedia.org/w/api.php?action=parse&page=' + title + '&prop=text&section=0&format=json&callback=callback';
}

window.addEventListener('load', function onLoad() {
    'use strict';
    var goButton = document.querySelector('button');
    goButton.addEventListener('click', onClick);
    contentPresenter = document.querySelector('#content');
});

