chrome.browserAction.onClicked.addListener(function() {
    chrome.windows.create({
        'url': 'codenote.html',
        'width': 500,
        'height': 400,
        'focused': true,
        'type': 'panel'
    });
});