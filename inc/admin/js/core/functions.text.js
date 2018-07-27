(function ($) {


    window.copyText = function (event) {
        var td = event.target.parentNode.parentNode.parentNode,
            copy = newText(event.target.parentNode.parentNode.childNodes[0].innerHTML);
        td.appendChild(copy);
    }

    window.deleteText = function(evt){
        var act=this.parentNode.parentNode,
            el = act.parentNode;
        el.removeChild(act); 
    }

    window.showTextSettings = function (event) {
        this.classList.add('wptb-directlyhovered');
        var btnDelete = document.createElement('span'),
            btnCopy = document.createElement('span'),
            actions = document.createElement('span'),
            previous, i;
        actions.classList.add('wptb-actions'); 
        btnDelete.classList.add('dashicons', 'dashicons-trash', 'delete-action');
        btnCopy.classList.add('dashicons', 'dashicons-admin-page', 'duplicate-action');
        btnDelete.onclick = window.deleteText;
        btnCopy.onclick = window.copyText;
        actions.appendChild(btnCopy);
        actions.appendChild(btnDelete);
        this.appendChild(actions); 
    };

    window.hideTextSettings = function (event) {
        var formerActions = this.getElementsByClassName('wptb-actions');
        if(formerActions && formerActions[0]){
            let par = formerActions[0].parentNode;
            par.removeChild(formerActions[0]);
        }
        this.classList.remove('wptb-directlyhovered'); 
         
    };

    window.newText = function (text) { 
        var elText = document.createElement('div');
        var elText2 = document.createElement('div');
        elText2.classList.add('editable');
        var elP = document.createElement('p');
        elP.innerHTML = text!=undefined ? text : 'Text';
        elText2.appendChild(elP);
        elText.appendChild(elText2);
        elText.onmouseenter = showTextSettings;
        elText.onmouseleave = hideTextSettings;
        elText.classList.add('wptb-ph-element','wptb-element-text-' + 
            window.wptb_num['text']);
        window.addElementOptions('text',elText);
        window.wptb_num['text']++;
        window.tinyFastCall(elText.childNodes[0]); 
        $(elText).click();
        return elText;
    }

})(jQuery);