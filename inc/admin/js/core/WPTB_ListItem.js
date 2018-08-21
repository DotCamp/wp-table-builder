var WPTB_ListItem = function (text) {

    if (text == undefined) text = 'New List Item';
    var DOMElement = document.createElement('article'),
        divdot = document.createElement('div'),
        divcontent = document.createElement('div'),
        libullet = document.createElement('li');
    divdot.classList.add('wptb-list-item-style-dot');
    divcontent.classList.add('wptb-list-item-content');
    libullet.classList.add('wptb-bullet');
    DOMElement.appendChild(divdot);
    DOMElement.appendChild(divcontent);
    divdot.appendChild(libullet);
    divcontent.innerHTML = text;
    divcontent.onkeyup = window.listItemKeyListener;
    divcontent.parentNode.onmouseenter = window.showListItemSettings;
    divcontent.parentNode.onmouseleave = window.hideListItemSettings;

    this.getDOMElement = function () {
        return DOMElement;
    }

    return this;

};