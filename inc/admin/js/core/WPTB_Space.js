var WPTB_Space = function ( elSpaceBetween ) {

    function newElementProxy(el) {
        if (el.includes('list')) {
            return new WPTB_List();
        } else if (el.includes('image')) {
            return new WPTB_Image();
        } else if (el.includes('text')) {
            return new WPTB_Text();
        } else if (el.includes('button')) {
            return new WPTB_Button();
        }
    }
    let spaceBetween;
    if ( ! elSpaceBetween ) {
        spaceBetween = document.createElement('div'), spaceBetween.classList.add('wptb-space-between');
    } else {
        spaceBetween = elSpaceBetween;
    }

    spaceBetween.ondragenter = function () {
        this.classList.add('visible');
    };
    spaceBetween.ondragover = function (event) {
        event.preventDefault();
    };

    spaceBetween.ondragleave = function () {
        this.classList.remove('visible');
    };

    spaceBetween.ondrop = function (event) {
        event.stopPropagation();

        var p = event.target.nextSibling,
            td = event.target,
            element, t_space, spaceParent;

        while ( !td.classList.contains('wptb-droppable') ) {
            td = td.parentNode;
        }

        if (event.dataTransfer.getData('wptbElement')) {
            element = newElementProxy(event.dataTransfer.getData('wptbElement'));
            this.classList.remove('visible');

            if (p == null) {
                td.appendChild(element.getDOMElement());
                td.appendChild(new WPTB_Space());
            } else {
                td.insertBefore(element.getDOMElement(), p);
                td.insertBefore(new WPTB_Space(), p);
            }

        } else {
            alert(event.dataTransfer.getData('node'));
            element = document.getElementsByClassName(event.dataTransfer.getData('node'))[0];
            t_space = element.nextSibling;
            spaceParent = element.parentNode;
            if (t_space != undefined) {
                spaceParent.removeChild(t_space);
            }

            if (p == null) {
                td.appendChild(element);
                td.appendChild(new WPTB_Space());
            } else {
                td.insertBefore(element, p);
                td.insertBefore(new WPTB_Space(), p);
            }

        }
        this.classList.remove('visible');
    };
    
    if ( ! elSpaceBetween ) {
        return spaceBetween;
    }
};