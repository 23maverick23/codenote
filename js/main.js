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

    var optionsUrl = chrome.extension.getURL("options.html");
    $('#codeNoteOptions').attr('href', optionsUrl);

    // update syntax mode dropdown
    function updateSyntaxModeDropdown(syntax) {
        var acemodeDropdownItem = $('#codeNoteSyntaxMode li[data-acemode="' + syntax + '"] a');
        var acemodeext = acemodeDropdownItem.parent().data('acemodeext');
        var acemodeText = acemodeDropdownItem.html();
        var acemodeDropdown = $('#codeNoteSyntaxModeText');
        acemodeDropdown.html(acemodeText);

        $('#codeNoteSyntaxMode li').each(function() {
            $(this).removeClass('active');
        })
        acemodeDropdownItem.parent().addClass('active');

        $('#codeNoteModalFilename').attr('placeholder', 'name_your_file.' + acemodeext);

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

    var form = $('#codeNoteGistForm');

    // initiate modal for gist posts
    $('#codeNodeGistModal').modal({
        keyboard: true,
        show: false
    });

    // clear all values on hide
    $('#codeNodeGistModal').on('hidden.bs.modal', function () {
        $('#codeNoteGistIcon').removeClass('fa-external-link fa-spinner fa-spin');
        $('#codeNoteGistUrl').attr('href', '#');
        $('#codeNoteGistUrl').html('');
        $('#codeNoteModalFilename').val('');
        $('#codeNoteModalDescription').val('');
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

    $("#codeNoteSecret").bind("click keypress", function () {
        // store the id of the submit-input on it's enclosing form
        form.data("callerid", this.id);
    });

    $("#codeNotePublic").bind("click keypress", function () {
        // store the id of the submit-input on it's enclosing form
        form.data("callerid", this.id);
    });

    // submit gist via ajax API
    form.submit(function() {
        var codeNoteGistIcon = $('#codeNoteGistIcon');
        codeNoteGistIcon.addClass('fa-spinner fa-spin');

        var callerId = ($(this).data("callerid") || 'codeNotePublic');

        var ghPublic = (callerId && callerId == 'codeNotePublic') ? true : false;
        var ghUrl = 'https://api.github.com/gists';
        var ghContent = editor.getSession().getValue();
        var ghFilename = $('#codeNoteModalFilename').val();
        var ghDescription = $('#codeNoteModalDescription').val();
        var OAUTH_TOKEN = store.get('codeNote.options.gisttoken');

        var jsoncontent = {
            "description": ghDescription,
            "public": ghPublic,
            "files": {}
        };
        jsoncontent.files[ghFilename] = { "content": ghContent };

        //perform the ajax request to github
        $.ajax(ghUrl, {
            type: 'POST',
            crossDomain: true,
            data: JSON.stringify(jsoncontent),
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', 'token ' + OAUTH_TOKEN);
                xhr.setRequestHeader('Accept', 'application/json');
                xhr.setRequestHeader('Content-Type', 'application/json');
            },
            success: function(data, status, response) {
                codeNoteGistIcon.removeClass('fa-spinner fa-spin');
                codeNoteGistIcon.addClass('fa-external-link');

                var gUrl = data.html_url;
                var codeNoteGistUrl = $('#codeNoteGistUrl');
                codeNoteGistUrl.attr('href', gUrl);
                codeNoteGistUrl.html(gUrl);

                // DEBUG
                // console.log(JSON.stringify(data));
            },
            error: function(response, status, error) {
                if (response.responseText.length > 0) {
                    var data = JSON.parse(response.responseText);
                    if (data.message) {
                        console.log(data.message);
                    }
                }
            }
        });

        return false;
    });
}());