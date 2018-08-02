(function ($) {

    window.copyImage = function (event) {
        var srcList = event.target.parentNode.parentNode,
            newList = srcList.cloneNode(true),
            container = srcList.parentNode,
            listItems = newList.querySelectorAll('article');
        newList.onmouseenter = showListSettings;
        newList.onmouseleave = hideListSettings;
        for (var i = listItems.length - 1; i >= 0; i--) {
            let cont = listItems[i].getElementsByClassName('wptb-list-item-content')[0];
            listItems[i].onmouseenter = showListItemSettings;
            listItems[i].onmouseleave = hideListItemSettings;
            cont.id = '';
            tinyFastCall(cont);
            cont.onkeyup = listItemKeyListener;
        }

        var infArr = newList.className.match(/wptb-element-(.+)-(\d)+/i),
            elName = infArr[1],
            oldClass = infArr[0],
            oldClassOptionsPanelClass = "wptb-options-" + elName + "-" + infArr[2];

        var newOptionsPanel = $('.' + oldClassOptionsPanelClass).clone(true, true),
            oldOptionsPanel = document.querySelector('.' + oldClassOptionsPanelClass);
        oldOptionsPanel.parentNode.appendChild(newOptionsPanel[0]);

        var newClass = "wptb-element-" + elName + "-" + wptb_num['list'];
        var newClassOptionsPanelClass = "wptb-options-" + elName + "-" + wptb_num['list'];

        newList.classList.add(newClass);
        newList.classList.remove(oldClass);

        newOptionsPanel.removeClass(oldClassOptionsPanelClass);
        newOptionsPanel.addClass(newClassOptionsPanelClass);

        wptb_num['list']++;

        container.appendChild(newList);
    }

    window.showImageSettings = function (event) {
        var btnDelete = document.createElement('span'),
            btnCopy = document.createElement('span'),
            actions = document.createElement('span'),
            previous, i;
        actions.classList.add('wptb-actions');
        btnDelete.classList.add('dashicons', 'dashicons-trash', 'delete-action');
        btnCopy.classList.add('dashicons', 'dashicons-admin-page', 'duplicate-action');
        delete document.getElementsByClassName('wptb-actions');
        previous = document.getElementsByClassName('wptb-directlyhovered');
        for (i = 0; i < previous.length; i++) {
            previous[i].classList.remove('wptb-directlyhovered');
        };
        this.classList.add('wptb-directlyhovered');

        btnDelete.onclick = function () {
            var list = this.parentNode.parentNode,
                tdContainer = list.parentNode;
            $('#add-elements a').trigger('click');
            tdContainer.removeChild(list);
        };
        btnCopy.onclick = copyList;

        actions.append(btnCopy, btnDelete);
        this.append(actions);
    };

    window.hideImageSettings = function (event) {
        this.classList.remove('wptb-directlyhovered');
        var actions = this.getElementsByClassName('wptb-actions')[0];
        if (actions != undefined) {
            let parent = actions.parentNode;
            parent.removeChild(actions);
        }
    };

    window.newImage = function (text) {
        var imgWrap = document.createElement('div');
        imgWrap.classList.add('wptb-img-wrapper');
        var imgBtn = document.createElement('button');
        imgBtn.classList.add('button');
        imgBtn.classList.add('wptb-img-btn');
        imgBtn.innerHTML = text != undefined ? text : 'Choose Image';
        imgWrap.appendChild(imgBtn);
        
        Medialibrary(imgBtn);
        $(imgBtn).click(function(){
            Medialibrary(this);
        });
        return imgWrap;
    }
    
    window.Medialibrary = function (button){
        // Set all variables to be used in scope
        button.frame;
        if( button.frame ){
            if(button.selectedId){
                // choose the selected image
                var selection =  button.frame.state().get('selection');
                selection.add(wp.media.attachment(button.selectedId));
            }
            button.frame.open();
            return;
        }
        
        // Create a new media frame
        button.frame = wp.media({
            title: 'Select The image',
            button:{
                text: 'Use this media'
            },
            multiple: false
        });
        
        // When an image is selected in the media frame...
        button.frame.on('select', function(){
            button.selectedId = button.frame.state().get('selection').models[0].id;
            var attachment = button.frame.state().get('selection').first().toJSON(),
            url = attachment.url,
            wrapper = button.parentNode;
            
            // if there's already an image
           if(typeof button.img == 'object'){
               $(button.img).prop('src',url);
               $(button.img).click();
               return;
           }
            
            // making image relative to the button in its objec
            button.img = document.createElement('img');
            $(button.img).prop('src',url);
            $(button.img).css('width','100%');
            button.img.classList.add('wptb-ph-element', 'wptb-element-image-'+window.wptb_num["image"]);
            var prop = window.addElementOptions('image', button.img);
            wrapper.appendChild(button.img);
            
            // convert add image button to change and append it to properties
            button.innerHTML = 'Change Image';
            prop.children('.wptb-settings-items').append(button);
            
            $(button.img).click();
        });
    }
    
})(jQuery);