;(function () {
    'use strict';

    // create editor with settings
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/chrome");
    editor.setHighlightActiveLine(true);
    editor.getSession().setUseWrapMode(true);
    editor.getSession().setTabSize(4);
    editor.getSession().setUseSoftTabs(true);

    // attempt to load new editor using localStorage
    var oldeditorvalue = store.get('codeNote.editor.value');
    var oldeditorsyntax = store.get('codeNote.editor.syntax');

    var editorvalue = (!oldeditorvalue || oldeditorvalue.length === null) ? '' : oldeditorvalue;
    var editorsyntax = (!oldeditorsyntax || oldeditorsyntax.length === null) ? 'markdown' : oldeditorsyntax;

    editor.setValue(editorvalue, 0);
    editor.getSession().setMode("ace/mode/" + editorsyntax);


    // update syntax mode dropdown
    function updateSyntaxModeDropdown(syntax) {
        var acemodeDropdownItem = $('#codeNoteSyntaxMode li[data-acemode="' + syntax + '"] a');
        var acemodeText = acemodeDropdownItem.html();
        var acemodeDropdown = $('#codeNoteSyntaxModeText');
        acemodeDropdown.html(acemodeText);

        $('#codeNoteSyntaxMode li').each(function() {
            $(this).removeClass('active');
        })
        acemodeDropdownItem.parent().addClass('active');
        $('#editor textarea').focus();
    }


    updateSyntaxModeDropdown(editorsyntax);


    // allow user to override syntax mode
    $('#codeNoteSyntaxMode li a').on('click', function() {
        var acemode = $(this).parent().data('acemode');
        var acemodeText = $(this).html();
        editor.getSession().setMode("ace/mode/" + acemode);

        store.set('codeNote.editor.syntax', acemode);

        updateSyntaxModeDropdown(acemode);
    });


    // give editor focus on load
    $('#editor textarea').focus();

    // add tooltips to toolbar
    $('.navbar-nav li a').each(function() {
        $(this).tooltip();
    });

    // initiate modal for gist posts
    $('#codeNodeGistModal').modal({
        keyboard: true,
        show: false
    });

    // show modal on click
    $('#codeNoteToolbarGist').on('click', function() {
        $('#codeNodeGistModal').modal('show');
    });

    // select all editor content
    $('#codeNoteToolbarSelectAll').on('click', function() {
        editor.selectAll();
        $('#editor textarea').focus();
    });

    // attempt to auto-save content to localStorage
    try {
        // Set the interval and autosave every 5 seconds
        setInterval(function() {
            var newvalue = editor.getSession().getValue();
            store.set('codeNote.editor.value', newvalue);
        }, 10000);  // every 10 seconds
    } catch (e) {
        // If any errors, catch and alert the user
        if (e == QUOTA_EXCEEDED_ERR) {
            alert('Quota exceeded!');
        }
    }

    store.set('codeNote.options.gisttoken', '8ab3cb8af303aef00eacc6a8c6340ed717ab38f6');
    var OAUTH_TOKEN = store.get('codeNote.options.gisttoken');

    var jsoncontent = {
        "description": "test gist",
        "public": true,
        "files": {
            "file1.txt": {
                "content": $('#editor textarea').val()
            }
        }
    };

    // send data to github
    $('#codeNoteGistCreateSecret').on('click', function(e) {
        e.preventDefault();
        console.log('Clicked');
        $.ajax({
            url: 'https://api.github.com/gists',
            dataType: 'json',
            data: jsoncontent,
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "token" + OAUTH_TOKEN);
            },
        })
        .done(function(data) {
            if (console && console.log) {
              console.log("Sample of data:", data.slice(0, 100));
            }
        });
    });
}());