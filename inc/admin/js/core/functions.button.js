(function ($) {

    window.deleteButton = function (event) {
        var act = this.parentNode.parentNode,
            el = act.parentNode;
        el.removeChild(act);
        window.add_Elements_tab();
    };

    window.copyButton = function (event) {
        var td = event.target.parentNode.parentNode.parentNode,
            copy = newButton(event.target.parentNode.parentNode.childNodes[0].innerHTML);
        td.appendChild(copy);
    };

    window.showButtonSettings = function (event) {
        this.classList.add('wptb-directlyhovered');
        var btnDelete = document.createElement('span'),
            btnCopy = document.createElement('span'),
            actions = document.createElement('span'),
            previous, i;
        actions.classList.add('wptb-actions');
        btnDelete.classList.add('dashicons', 'dashicons-trash', 'delete-action');
        btnCopy.classList.add('dashicons', 'dashicons-admin-page', 'duplicate-action');
        btnDelete.onclick = window.deleteButton;
        btnCopy.onclick = window.copyButton;
        actions.appendChild(btnCopy);
        actions.appendChild(btnDelete);
        this.appendChild(actions);
    };

    window.hideButtonSettings = function (event) {
        var formerActions = this.getElementsByClassName('wptb-actions');
        if (formerActions && formerActions[0]) {
            let par = formerActions[0].parentNode;
            par.removeChild(formerActions[0]);
        }
        this.classList.remove('wptb-directlyhovered');
    };

    window.newButton = function (text) {
        var elButton = document.createElement('div');
        elButton.classList.add('wptb-button-container');
        var elButton2 = document.createElement('div');
        elButton2.classList.add('wptb-button-wrapper');
        var el_B = document.createElement('p');
        el_B.classList.add('wptb-button');
        el_B.classList.add('editable');
        el_B.innerHTML = text != undefined ? text : 'Button Text';
        elButton2.appendChild(el_B);
        elButton.appendChild(elButton2);
        elButton.onmouseenter = showButtonSettings;
        elButton.onmouseleave = hideButtonSettings;
        elButton.classList.add('wptb-ph-element', 'wptb-element-button-' +
            window.wptb_num['button']);
        window.addElementOptions('button', elButton);
        window.wptb_num['button']++;
        tinyMCE.init({
            target: el_B,
            inline: true,
            plugins: "link",
            dialog_type: "modal",
            theme: 'modern',
            menubar: false,
            fixed_toolbar_container: '#wpcd_fixed_toolbar',
            toolbar: 'bold italic strikethrough',
            setup: function (ed) {
                ed.on("init",
                    function (ed) {
                        tinyMCE.execCommand('mceRepaint');
                    }
                );
            },
            init_instance_callback: function (editor) {
                editor.on('change', function (e) {
                    // check if it becomes empty because if there's no value it's hard to edit the editor in button element
                    if (editor.getContent() == "") {
                        editor.setContent("<p class='wptb-button'>Button Text</p>");
                    }
                });
                editor.on('KeyDown', function (e) {
                    var range = editor.selection.getRng();
                    var KeyID = e.keyCode;
                    if (range.startOffset == 0 && (KeyID == 8 || KeyID == 46)) {
                        e.preventDefault();
                        editor.setContent("<p class='wptb-button'></p>");
                    }
                });
            }
        });

        return elButton;
    }

})(jQuery);