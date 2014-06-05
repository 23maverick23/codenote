;(function () {
    'use strict';

    $('#codeNoteOptions').submit(function() {
        var OAUTH_TOKEN = $('#codeNoteGistToken').val();
        store.set('codeNote.options.gisttoken', OAUTH_TOKEN);
        $('#codeNoteGistToken').parent().addClass('has-success');
    });
}());