;(function () {
    'use strict';

    var injectFont = function inject (font) {
        var f = document.createElement('style');
        f.type = 'text/css';
        f.textContent = '@font-face {' +
            'font-family: FontAwesome;' +
            'src: url("' +
                chrome.extension.getURL(font) +
            '");' +
        '}';
        (document.head || document.documentElement).appendChild(f);
    };

    injectFont('fonts/fontawesome-webfont.woff');


    var injectScripts = function inject (scripts) {
        var s = document.createElement('script');
        s.src = chrome.extension.getURL(scripts[0]);
        s.onload = function () {
            this.parentNode.removeChild(this);
            if (scripts.length > 1) {
                inject(scripts.slice(1));
            }
        };
        (document.head || document.documentElement).appendChild(s);
    };

    injectScripts([
        'vendor/jquery-1.11.1.min.js',
        'vendor/bootstrap-3.1.1.min.js',
        'vendor/src-noconflict/ace.js',
        'js/main.js'
    ]);
}());