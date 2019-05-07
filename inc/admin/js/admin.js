var applyGenericItemSettings = function applyGenericItemSettings(element, kindIndexProt) {
	var copy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	var node = element.getDOMElement(),
	    index,
	    listItems,
	    copy;

	if (kindIndexProt == undefined || copy == true) {
		index = document.counter.nextIndex(element.kind);
		var wptbElements = document.getElementsByClassName('wptb-ph-element');
		if (wptbElements.length > 0) {
			index = wptbElements.length + 1;
		} else {
			index = 1;
		}
	} else if (kindIndexProt && !copy) {
		index = kindIndexProt.split('-')[1];
	}

	node.onmouseenter = function (event) {
		this.classList.add('wptb-directlyhovered');
		var btnDelete = document.createElement('span'),
		    btnCopy = document.createElement('span'),
		    btnMove = document.createElement('span'),
		    actions = document.createElement('span'),
		    previous = void 0,
		    i = void 0;

		actions.classList.add('wptb-actions');
		btnDelete.classList.add('dashicons', 'dashicons-trash', 'delete-action');
		btnCopy.classList.add('dashicons', 'dashicons-admin-page', 'duplicate-action');
		btnMove.classList.add("dashicons", "dashicons-move", 'move-action');
		btnMove.draggable = true;
		btnDelete.onclick = function (event) {
			var act = this.parentNode.parentNode,
			    el = act.parentNode,
			    space = act.nextSibling,
			    num,
			    space2;
			el.removeChild(act);
			el.removeChild(space);
			num = el.getElementsByClassName('wptb-ph-element').length;
			if (!num) {
				space2 = el.getElementsByClassName('wptb-space-between')[0];
				if (space2) {
					el.removeChild(space2);
				}
			}
		};
		btnCopy.onclick = function (event) {
			if (element.kind == 'list') {
				var td = event.target.parentNode.parentNode.parentNode,
				    temp = [],
				    srcList = event.target.parentNode.parentNode.querySelectorAll('ul li .wptb-list-item-content');

				for (var i = 0; i < srcList.length; i++) {
					temp.push(srcList[i].innerHTML);
				}

				var copy = new WPTB_List(temp, node);

				node.parentNode.insertBefore(copy.getDOMElement(), node.nextSibling);
				node.parentNode.insertBefore(new WPTB_Space(), copy.getDOMElement());
			} else if (element.kind == 'text') {
				var td = event.target.parentNode.parentNode.parentNode,
				    copy = new WPTB_Text(event.target.parentNode.parentNode.childNodes[0].innerHTML, node);

				node.parentNode.insertBefore(copy.getDOMElement(), node.nextSibling);
				node.parentNode.insertBefore(new WPTB_Space(), copy.getDOMElement());
			} else if (element.kind == 'image') {
				var td = event.target.parentNode.parentNode.parentNode,
				    copy = new WPTB_Image(event.target.parentNode.parentNode.children[0].children[0].src, node);

				node.parentNode.insertBefore(copy.getDOMElement(), node.nextSibling);
				node.parentNode.insertBefore(new WPTB_Space(), copy.getDOMElement());
			} else {
				var td = event.target.parentNode.parentNode.parentNode,
				    copy = new WPTB_Button(event.target.parentNode.parentNode.childNodes[0].innerHTML, node);

				node.parentNode.insertBefore(copy.getDOMElement(), node.nextSibling);
				node.parentNode.insertBefore(new WPTB_Space(), copy.getDOMElement());
			}
		};
		btnMove.ondragstart = function (event) {
			var parent = this,
			    infArr,
			    type;

			while (parent.className == '' || !parent.classList.contains('wptb-ph-element')) {
				parent = parent.parentNode;
			}

			infArr = parent.className.match(/wptb-element-(.+)-(\d+)/i);
			type = infArr[1];

			var img = document.createElement("img");
			img.src = "http://localhost/sandbox/wp-content/plugins/wp-table-builder/inc/admin/views/builder/icons/" + type + ".png";
			event.dataTransfer.setDragImage(img, 0, 0);
			event.dataTransfer.setData('node', 'wptb-element-' + infArr[1] + '-' + infArr[2]);
		};

		if (element.kind === 'button') {
			tinyMCE.init({
				target: node.childNodes[0].childNodes[0],
				inline: true,
				plugins: "link",
				dialog_type: "modal",
				theme: 'modern',
				menubar: false,
				fixed_toolbar_container: '#wpcd_fixed_toolbar',
				toolbar: 'bold italic strikethrough',
				verify_html: false,
				setup: function setup(ed) {
					ed.on("init", function (ed) {
						tinyMCE.execCommand('mceRepaint');
					});
				},
				init_instance_callback: function init_instance_callback(editor) {
					editor.on('change', function (e) {
						// check if it becomes empty because if there's no value it's hard to edit the editor in button element
						if (editor.getContent().trim() == "") {
							editor.setContent("<a class='wptb-button'>Button Text</a>");
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

					window.currentEditor = editor;
					editor.on('focus', function (e) {
						var totalWidth = document.getElementsByClassName('wptb-builder-panel')[0].offsetWidth;
						if (window.currentEditor && document.getElementById('wptb_builder').scrollTop >= 55 && window.currentEditor.bodyElement.style.display != 'none') {
							document.getElementById('wpcd_fixed_toolbar').style.position = 'fixed';
							document.getElementById('wpcd_fixed_toolbar').style.right = totalWidth / 2 - document.getElementById('wpcd_fixed_toolbar').offsetWidth / 2 + 'px';
							document.getElementById('wpcd_fixed_toolbar').style.top = '100px';
						} else {
							document.getElementById('wpcd_fixed_toolbar').style.position = 'static';
							delete document.getElementById('wpcd_fixed_toolbar').style.right;
							delete document.getElementById('wpcd_fixed_toolbar').style.top;
						}
					});
				}
			});
		} else if (element.kind === 'text') {
			tinyMCE.init({
				target: node.childNodes[0],
				inline: true,
				plugins: "link, paste",
				dialog_type: "modal",
				theme: 'modern',
				menubar: false,
				fixed_toolbar_container: '#wpcd_fixed_toolbar',
				paste_as_text: true,
				toolbar: 'bold italic strikethrough link unlink | alignleft aligncenter alignright alignjustify',
				init_instance_callback: function init_instance_callback(editor) {
					window.currentEditor = editor;
					editor.on('focus', function (e) {

						var totalWidth = document.getElementsByClassName('wptb-builder-panel')[0].offsetWidth;
						if (window.currentEditor && document.getElementById('wptb_builder').scrollTop >= 55 && window.currentEditor.bodyElement.style.display != 'none') {
							document.getElementById('wpcd_fixed_toolbar').style.position = 'fixed';
							document.getElementById('wpcd_fixed_toolbar').style.right = totalWidth / 2 - document.getElementById('wpcd_fixed_toolbar').offsetWidth / 2 + 'px';
							document.getElementById('wpcd_fixed_toolbar').style.top = '100px';
						} else {
							document.getElementById('wpcd_fixed_toolbar').style.position = 'static';
							delete document.getElementById('wpcd_fixed_toolbar').style.right;
							delete document.getElementById('wpcd_fixed_toolbar').style.top;
						}
					});
				}
			});
		} else {
			listItems = node.getElementsByClassName('wptb-list-item-content');
			for (var _i = 0; _i < listItems.length; _i++) {
				tinyMCE.init({
					target: listItems[_i],
					inline: true,
					plugins: "link, paste",
					dialog_type: "modal",
					theme: 'modern',
					menubar: false,
					fixed_toolbar_container: '#wpcd_fixed_toolbar',
					paste_as_text: true,
					toolbar: 'bold italic strikethrough link unlink | alignleft aligncenter alignright alignjustify',
					init_instance_callback: function init_instance_callback(editor) {
						window.currentEditor = editor;
						editor.on('focus', function (e) {
							var totalWidth = document.getElementsByClassName('wptb-builder-panel')[0].offsetWidth;
							if (window.currentEditor && document.getElementById('wptb_builder').scrollTop >= 55 && window.currentEditor.bodyElement.style.display != 'none') {
								document.getElementById('wpcd_fixed_toolbar').style.position = 'fixed';
								document.getElementById('wpcd_fixed_toolbar').style.right = totalWidth / 2 - document.getElementById('wpcd_fixed_toolbar').offsetWidth / 2 + 'px';
								document.getElementById('wpcd_fixed_toolbar').style.top = '100px';
							} else {
								document.getElementById('wpcd_fixed_toolbar').style.position = 'static';
								delete document.getElementById('wpcd_fixed_toolbar').style.right;
								delete document.getElementById('wpcd_fixed_toolbar').style.top;
							}
						});
					}
				});
			}
		}

		actions.appendChild(btnMove);
		actions.appendChild(btnCopy);
		actions.appendChild(btnDelete);
		//                let actionOld = this.querySelector( '.wptb-actions' );
		//                if( actionOld ) {
		//                    this.removeChild( actionOld );
		//                }
		this.appendChild(actions);
	};

	node.onmouseleave = function (event) {
		var formerActions = this.getElementsByClassName('wptb-actions');
		if (formerActions && formerActions[0]) {
			var par = formerActions[0].parentNode;
			par.removeChild(formerActions[0]);
		}
		this.classList.remove('wptb-directlyhovered');
	};

	var node_wptb_element_kind_num = node.className.match(/wptb-element-(.+)-(\d+)/i);
	if (node_wptb_element_kind_num) {
		node.classList.remove(node_wptb_element_kind_num[0]);
	}
	if (!node.classList.contains('wptb-ph-element')) {
		node.classList.add('wptb-ph-element');
		if (!node.classList.contains('wptb-element-' + element.kind + '-' + index)) {
			node.classList.add('wptb-element-' + element.kind + '-' + index);
		}
	} else {
		if (!node.classList.contains('wptb-element-' + element.kind + '-' + index)) {
			node.classList.add('wptb-element-' + element.kind + '-' + index);
		}
	}
	new WPTB_ElementOptions(element, index, kindIndexProt);

	document.counter.increment(element.kind);
};

(function () {

    function detectMode() {
        var url = window.location.href,
            regex = new RegExp('[?&]table(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return false;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    var WPTB_Builder = function WPTB_Builder() {
        var table_id = detectMode();
        if (table_id) {
            var http = new XMLHttpRequest(),
                url = ajaxurl + "?action=get_table" + '&id=' + table_id;
            http.open('GET', url, true);
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            http.onreadystatechange = function (d) {
                if (this.readyState == 4 && this.status == 200) {
                    var ans = JSON.parse(http.responseText);
                    document.getElementById('wptb-setup-name').value = ans[0];
                    document.getElementsByClassName('wptb-table-generator')[0].style.display = 'none';
                    var wptbTableSetupEl = document.getElementsByClassName('wptb-table-setup')[0];
                    wptbTableSetupEl.appendChild(WPTB_Parser(ans[1]));
                    WPTB_Table();
                    WPTB_LeftPanel();
                    WPTB_Settings();
                    return;
                }
            };
            http.send(null);
        }
        document.counter = new ElementCounters();
        document.select = new MultipleSelect();

        var initializer = WPTB_Initializer();
        settings = WPTB_Settings();
    };

    document.addEventListener('DOMContentLoaded', WPTB_Builder);
})();
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var WPTB_Button = function WPTB_Button(text, DOMElementProt) {

    var DOMElement = document.createElement('div'),
        elButton2 = document.createElement('div'),
        el_B = document.createElement('a'),
        kindIndexProt = undefined,
        copy = false;

    DOMElement.classList.add('wptb-button-container', 'wptb-size-M', 'wptb-');
    elButton2.classList.add('wptb-button-wrapper');
    el_B.classList.add('wptb-button');
    el_B.classList.add('editable');
    el_B.classList.add('editable');
    el_B.innerHTML = text != undefined ? text : 'Button Text';

    // Creation of a new button when copying to avoid errors when assigning new event handlers.
    if (DOMElementProt) {
        var wptbElementMutch = DOMElementProt.className.match(/wptb-element-((.+-)\d+)/i);
        if (wptbElementMutch && Array.isArray(wptbElementMutch)) {
            kindIndexProt = wptbElementMutch[1];
            copy = true;
        };
        var attributesContainer = [].concat(_toConsumableArray(DOMElementProt.attributes));
        if (attributesContainer.length > 0) {
            for (var i = 0; i < attributesContainer.length; i++) {
                DOMElement.setAttribute(attributesContainer[i].name, attributesContainer[i].value);
            }
        }

        var wptbButtonWrapper = DOMElementProt.querySelector('.wptb-button-wrapper');
        if (wptbButtonWrapper) {
            var wptbButtonWrapAttributes = [].concat(_toConsumableArray(wptbButtonWrapper.attributes));
            if (wptbButtonWrapAttributes.length > 0) {
                for (var _i = 0; _i < wptbButtonWrapAttributes.length; _i++) {
                    if (wptbButtonWrapAttributes[_i].name == 'style') {
                        elButton2.setAttribute(wptbButtonWrapAttributes[_i].name, wptbButtonWrapAttributes[_i].value);
                    }
                }
            }
        }

        var wptbButton = DOMElementProt.querySelector('.wptb-button');
        if (wptbButton) {
            var wptbButtonAttributes = [].concat(_toConsumableArray(wptbButton.attributes));
            if (wptbButtonAttributes.length > 0) {
                for (var _i2 = 0; _i2 < wptbButtonAttributes.length; _i2++) {
                    if (wptbButtonAttributes[_i2].name == 'style' || wptbButtonAttributes[_i2].name == 'href' || wptbButtonAttributes[_i2].name == 'target') {
                        el_B.setAttribute(wptbButtonAttributes[_i2].name, wptbButtonAttributes[_i2].value);
                    }
                }
            }
        }
    }

    elButton2.appendChild(el_B);
    DOMElement.appendChild(elButton2);

    this.kind = 'button';

    this.getDOMElement = function () {
        return DOMElement;
    };

    applyGenericItemSettings(this, kindIndexProt, copy);

    return this;
};
var WPTB_Cell = function WPTB_Cell(callback, DOMElement) {

    function newElementProxy(el) {
        if (el == 'list') {
            return new WPTB_List();
        } else if (el == 'image') {
            return new WPTB_Image();
        } else if (el == 'text') {
            return new WPTB_Text();
        } else if (el == 'button') {
            return new WPTB_Button();
        }
    }

    function highlightRow(td) {
        var parentRow = td.parentNode,
            columnCount = parseInt(document.getElementById('wptb-columns-number').value),
            tds = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
        for (var i = 0; i < tds.length; i++) {
            tds[i].classList.remove('highlighted-row-first', 'highlighted-row-last', 'highlighted-row-inner', 'highlighted-column-first', 'highlighted-column-last', 'highlighted-column-inner');
        }
        for (var i = 0; i < columnCount; i++) {

            var classToAdd = i == 0 ? 'highlighted-row-first' : i == columnCount - 1 ? 'highlighted-row-last' : 'highlighted-row-inner';
            var ttd = parentRow.getElementsByTagName('td')[i];
            if (ttd !== td) {
                ttd.classList.add(classToAdd);
            }
        }
    }

    function highlightColumn(td) {

        var index,
            parentRow = td.parentNode;
        columnCount = parseInt(document.getElementById('wptb-columns-number').value), rowCount = parseInt(document.getElementById('wptb-rows-number').value), table = document.getElementsByClassName('wptb-preview-table')[0];
        for (var i = 0; i < columnCount; i++) {
            if (parentRow.getElementsByTagName('td')[i] === td) {
                index = i;
                break;
            }
        }

        for (var i = 0; i < rowCount; i++) {
            var classToAdd = i == 0 ? 'highlighted-column-first' : i == rowCount - 1 ? 'highlighted-column-last' : 'highlighted-column-inner';
            var tr = table.getElementsByTagName('tr')[i];
            if (tr.getElementsByTagName('td')[index] !== td) {
                tr.getElementsByTagName('td')[index].classList.add(classToAdd);
            }
        }
    }

    if (!DOMElement) {
        DOMElement = document.createElement("td");

        DOMElement.style.padding = jQuery('#wptb-table-padding-number').val() + 'px';

        var innerBorderWidth = jQuery('#wptb-table-inner-border-number').val();

        if (innerBorderWidth != '' && parseInt(innerBorderWidth) != 0) {
            DOMElement.style.border = innerBorderWidth + 'px solid ' + jQuery('#wptb-table-border-color').val();
        } else {
            DOMElement.style.border = '1px dashed #969fa6';
        }

        DOMElement.classList.add('wptb-droppable', 'wptb-cell');
    }

    DOMElement.draggable = false;
    if (callback) {
        DOMElement.onclick = callback;
    }

    DOMElement.ondragenter = function (e) {
        var div;
        if (!e.dataTransfer.getData('wptbElement') && !e.dataTransfer.getData('node')) {
            return;
        }
        this.classList.add('wptb-drop-here-empty');
    };

    DOMElement.ondragover = function (e) {
        e.preventDefault();
    };

    DOMElement.ondragleave = function () {
        this.classList.remove('wptb-drop-here-empty');
    };

    DOMElement.ondrop = function (e) {
        var element, classId, space, t_space, spaceParent;
        e.preventDefault();
        space = new WPTB_Space();

        if (!e.dataTransfer.getData('wptbElement') && !e.dataTransfer.getData('node')) {
            return;
        }

        if (e.dataTransfer.getData('wptbElement')) {
            element = newElementProxy(e.dataTransfer.getData('wptbElement'));
            if (this.innerHTML == '') {
                this.appendChild(new WPTB_Space());
            }
            this.appendChild(element.getDOMElement());
            this.appendChild(space);
        } else {
            classId = e.dataTransfer.getData('node');
            element = document.getElementsByClassName(classId)[0];
            if (this.innerHTML == '') {
                t_space = element.nextSibling;
                spaceParent = element.parentNode;
                if (t_space != undefined) {
                    spaceParent.removeChild(t_space);
                }
                this.appendChild(new WPTB_Space());
            }
            this.appendChild(element);
            this.appendChild(space);
        }
        this.classList.remove('wptb-drop-here-empty');
        return true;
    };

    var wptbPhElement = DOMElement.getElementsByClassName('wptb-ph-element');

    if (wptbPhElement.length > 0) {
        var _loop = function _loop(i) {

            var wptbSpaceBetween = DOMElement.getElementsByClassName('wptb-space-between');

            if (wptbSpaceBetween.length > 0) {
                for (var j = 0; j < wptbSpaceBetween.length; j++) {
                    WPTB_Space(wptbSpaceBetween[j]);
                }
            }

            wptbPhElement[i].getDOMElement = function () {
                return wptbPhElement[i];
            };

            var wptbElementTypeClass = wptbPhElement[i].className.match(/wptb-element-((.+-)\d+)/i);
            if (wptbElementTypeClass && Array.isArray(wptbElementTypeClass)) {
                var wptbTypeElementArr = wptbElementTypeClass[1].split('-');
                wptbPhElement[i].kind = wptbTypeElementArr[0];
                applyGenericItemSettings(wptbPhElement[i], wptbElementTypeClass[1]);
                if (wptbPhElement[i].kind == 'list') {
                    var wptbListItems = wptbPhElement[i].getElementsByTagName('li');
                    if (wptbListItems.length > 0) {
                        for (var _i = 0; _i < wptbListItems.length; _i++) {
                            WPTB_ListItem(undefined, wptbListItems[_i]);
                        }
                    }
                }
            }
        };

        for (var i = 0; i < wptbPhElement.length; i++) {
            _loop(i);
        }
    }

    this.getDOMElement = function () {
        return DOMElement;
    };

    this.setCoords = function (y, x) {
        var el = this.getDOMElement();
        el.dataset.yIndex = y;
        el.dataset.xIndex = x;
    };

    this.getCoords = function () {
        var coords,
            el = this.getDOMElement();
        coords.x = el.dataset.xIndex;
        coords.y = el.dataset.yIndex;
        return coords;
    };

    this.appendElement = function (node) {
        getDOMElement().appendChild(node);
    };

    return this;
};
var ElementCounters = function ElementCounters() {

	var priv = [];
	priv['text'] = 0;
	priv['image'] = 0;
	priv['list'] = 0;
	priv['button'] = 0;

	this.increment = function (key) {
		if (!(key in priv)) {
			return;
		}
		priv[key]++;
	};

	this.nextIndex = function (key) {
		if (!(key in priv)) {
			return undefined;
		}
		return priv[key] + 1;
	};

	return this;
};
var WPTB_ElementOptions = function WPTB_ElementOptions(element, index, kindIndexProt) {

    var node = element.getDOMElement(),
        elemIdClass;

    prop = document.querySelector(".wptb-" + element.kind + "-options-prototype").cloneNode(true);
    prop.classList.remove("wptb-" + element.kind + "-options-prototype"); // remove prototype from the class
    elemIdClass = 'wptb-options-' + element.kind + "-" + index;

    var properties = prop.getElementsByClassName('wptb-element-property');

    for (var i = 0; i < properties.length; i++) {
        properties[i].dataset.element = elemIdClass;
    }

    prop.classList.add(elemIdClass);
    document.getElementById("element-options-group").appendChild(prop);

    if (kindIndexProt) {
        if (element.kind == 'button') {
            var _affectedEl = document.getElementsByClassName('wptb-element-' + kindIndexProt)[0],
                wptbButtonWrapper = void 0,
                wptbButton = void 0,
                wptbSize = void 0;

            if (_affectedEl) {
                wptbSize = _affectedEl.className.match(/wptb-size-([a-z]+)/i);
            }

            if (wptbSize && Array.isArray(wptbSize)) {
                var b = prop.getElementsByClassName('wptb-btn-size-btn');

                for (var i = 0; i < b.length; i++) {
                    b[i].classList.remove('selected');

                    if (b[i].innerHTML == wptbSize[1]) {
                        b[i].classList.add('selected');
                    }
                }
            }

            if (_affectedEl) {
                wptbButtonWrapper = _affectedEl.getElementsByClassName('wptb-button-wrapper');

                wptbButton = _affectedEl.getElementsByClassName('wptb-button');
            }

            if (wptbButtonWrapper) {
                var buttonAlignment = wptbButtonWrapper[0].style.justifyContent,
                    buttonAlignmentSelect = prop.querySelector('select[data-type="button-alignment"]'),
                    selectOption = buttonAlignmentSelect.getElementsByTagName('option'),
                    selectOptionVal = void 0;

                if (buttonAlignment == 'flex-start') {
                    selectOptionVal = 'left';
                } else if (buttonAlignment == 'center' || !buttonAlignment) {
                    selectOptionVal = 'center';
                } else if (buttonAlignment == 'flex-end') {
                    selectOptionVal = 'right';
                }

                for (var _i = 0; _i < selectOption.length; _i++) {
                    if (selectOption[_i].value == selectOptionVal) {
                        selectOption[_i].selected = true;
                    }
                }
            }

            if (wptbButton) {
                var buttonTextColor = wptbButton[0].style.color,
                    buttonColor = wptbButton[0].style.backgroundColor,
                    buttonHref = wptbButton[0].getAttribute('href'),
                    buttonLinkTarget = wptbButton[0].getAttribute('target'),
                    buttonTextColorInput = prop.querySelector('input[data-type="button-text-color"]'),
                    buttonBackgroundColorInput = prop.querySelector('input[data-type="button-color"]'),
                    buttonHrefInput = prop.querySelector('input[data-type="button-link"]'),
                    buttonLinkTargetInput = prop.querySelector('input[data-type="button-link-target"]'),
                    buttonLinkTargetInputId = buttonLinkTargetInput.getAttribute('id'),
                    buttonLinkTargetInputLabel = buttonLinkTargetInput.parentNode.getElementsByTagName('label')[0];

                buttonLinkTargetInputId = buttonLinkTargetInputId + '-' + kindIndexProt.split('-')[1];

                buttonLinkTargetInput.setAttribute('id', buttonLinkTargetInputId);
                buttonLinkTargetInputLabel.setAttribute('for', buttonLinkTargetInputId);

                buttonTextColorInput.value = buttonTextColor;

                buttonBackgroundColorInput.value = buttonColor;

                buttonHrefInput.value = buttonHref;

                if (buttonLinkTarget && buttonLinkTarget == '_blank') {
                    buttonLinkTargetInput.checked = true;
                }
            }
        } else if (element.kind == 'image') {
            var _affectedEl2 = document.getElementsByClassName('wptb-element-' + kindIndexProt);
            if (_affectedEl2.length > 0) {
                var elementsA = _affectedEl2[0].getElementsByTagName('a');
                if (elementsA.length > 0) {
                    var a = elementsA[0];

                    if (a) {
                        a.onclick = function (e) {
                            e.preventDefault();
                        };
                        // set select according to the alignment of the image
                        var aTextAlign = a.style.textAlign,
                            imageAlignmentSelect = prop.querySelector('select[data-type="image-alignment"]'),
                            _selectOption = imageAlignmentSelect.getElementsByTagName('option');

                        for (var _i2 = 0; _i2 < _selectOption.length; _i2++) {
                            if (_selectOption[_i2].value == aTextAlign) {
                                _selectOption[_i2].selected = true;
                            }
                        }

                        // set text link for input field of setting panel
                        var imageLinkHref = a.getAttribute('href'),
                            inputImageLink = prop.querySelector('input[data-type="image-link"]');
                        if (imageLinkHref) {
                            inputImageLink.value = imageLinkHref;
                        }

                        // set checkbox for target of link 
                        var imageLinkTarget = a.getAttribute('target'),
                            imageLinkTargetInput = prop.querySelector('input[data-type="image-link-target"]'),
                            imageLinkTargetInputId = imageLinkTargetInput.getAttribute('id'),
                            imageLinkTargetInputLabel = imageLinkTargetInput.parentNode.getElementsByTagName('label')[0];

                        imageLinkTargetInputId = imageLinkTargetInputId + '-' + kindIndexProt.split('-')[1];

                        imageLinkTargetInput.setAttribute('id', imageLinkTargetInputId);
                        imageLinkTargetInputLabel.setAttribute('for', imageLinkTargetInputId);

                        if (imageLinkTarget && imageLinkTarget == '_blank') {
                            imageLinkTargetInput.checked = true;
                        }

                        var img = a.getElementsByTagName('img');
                        if (img.length > 0) {
                            // set value for input fields of image size
                            var imgWidth = img[0].style.width;
                            if (imgWidth) {
                                var imageWidthInputRange = prop.querySelector('input[type="range"][data-type="image-size"]'),
                                    imageWidthInputNumber = prop.querySelector('input[type="number"][data-type="image-size"]');

                                imageWidthInputRange.value = parseInt(imgWidth);
                                imageWidthInputNumber.value = parseInt(imgWidth);
                            }

                            // set value for input field of alternative text image
                            var imgAlternativeText = img[0].getAttribute('alt'),
                                imageAlternativeTextInput = prop.querySelector('input[type="text"][data-type="alternative-text"]');

                            imageAlternativeTextInput.value = imgAlternativeText;
                        }
                    }
                }
            }
        } else if (element.kind == 'text') {
            var _affectedEl3 = document.getElementsByClassName('wptb-element-' + kindIndexProt);
            if (_affectedEl3.length > 0) {
                var elementFontSize = _affectedEl3[0].style.fontSize,
                    elementTextColor = _affectedEl3[0].style.color;
                var textFontSizeInputRange = prop.querySelector('input[type="range"][data-type="font-size"]'),
                    textFontSizeInputNumber = prop.querySelector('input[type="number"][data-type="font-size"]'),
                    textColorInput = prop.querySelector('input[type="text"][data-type="color"]');

                textFontSizeInputRange.value = parseInt(elementFontSize);
                textFontSizeInputNumber.value = parseInt(elementFontSize);
                textColorInput.value = elementTextColor;
            }
        } else if (element.kind == 'list') {
            var elementList = document.getElementsByClassName('wptb-element-' + kindIndexProt);
            if (elementList.length > 0) {
                var elementListItem = elementList[0].querySelectorAll('li');

                if (elementListItem.length > 0) {
                    var listItemStyleType = elementListItem[0].style.listStyleType;
                    if (listItemStyleType && listItemStyleType != 'decimal') {
                        var elementListClassSelect = prop.querySelector('select[data-type="list-class"]');
                        if (elementListClassSelect) {
                            elementListClassSelect.value = 'unordered';

                            var listIconSelectLabel = elementListClassSelect.parentNode.nextSibling;
                            for (var _i3 = 0; _i3 < 10; _i3++) {
                                if (listIconSelectLabel.nodeType == '1') {
                                    break;
                                } else {
                                    listIconSelectLabel = listIconSelectLabel.nextSibling;
                                }
                            }
                            if (listIconSelectLabel) {
                                var listIconSelectLabelId = listIconSelectLabel.getAttribute('id');
                                listIconSelectLabel.setAttribute('id', listIconSelectLabelId + '-' + kindIndexProt);
                                listIconSelectLabel.style.display = 'flex';
                            }

                            var elementListStyleTypeSelect = prop.querySelector('select[data-type="list-style-type"]');
                            if (elementListStyleTypeSelect) {
                                elementListStyleTypeSelect.parentNode.style.display = 'flex';

                                elementListStyleTypeSelect.value = listItemStyleType;
                            }
                        }
                    }
                }

                var elementListItemContent = elementList[0].getElementsByClassName('wptb-list-item-content');

                if (elementListItemContent.length > 0) {
                    var listItemPTextAlignArr = [];
                    for (var _i4 = 0; _i4 < elementListItemContent.length; _i4++) {
                        var p = elementListItemContent[_i4].querySelector('p');
                        if (p) {
                            if (p.style.textAlign) {
                                listItemPTextAlignArr.push(p.style.textAlign);
                            } else {
                                listItemPTextAlignArr.push('left');
                            }
                        }
                    }

                    var listItemPTextAlignLeftCount = 0,
                        listItemPTextAlignCenterCount = 0,
                        listItemPTextAlignRightCount = 0;

                    if (listItemPTextAlignArr.length > 0) {
                        for (var _i5 = 0; _i5 < listItemPTextAlignArr.length; _i5++) {
                            if (listItemPTextAlignArr[_i5]) {
                                if (listItemPTextAlignArr[_i5] == 'left') {
                                    listItemPTextAlignLeftCount++;
                                } else if (listItemPTextAlignArr[_i5] == 'center') {
                                    listItemPTextAlignCenterCount++;
                                } else if (listItemPTextAlignArr[_i5] == 'right') {
                                    listItemPTextAlignRightCount++;
                                }
                            }
                        }
                    }

                    var elementListAlignmentSelect = prop.querySelector('select[data-type="list-alignment"]'),
                        maxListItemTAlLeftC = Math.max(listItemPTextAlignLeftCount, listItemPTextAlignCenterCount, listItemPTextAlignRightCount);

                    if (listItemPTextAlignLeftCount == maxListItemTAlLeftC) {
                        elementListAlignmentSelect.value = 'left';
                    } else if (listItemPTextAlignCenterCount == maxListItemTAlLeftC) {
                        elementListAlignmentSelect.value = 'center';
                    } else if (listItemPTextAlignRightCount == maxListItemTAlLeftC) {
                        elementListAlignmentSelect.value = 'right';
                    }
                }
            }
        }
    }

    node.onclick = function () {
        var infArr = this.className.match(/wptb-element-((.+-)\d+)/i),
            optionsClass = '.wptb-' + infArr[2] + 'options' + '.wptb-options-' + infArr[1];

        document.getElementById('add-elements').getElementsByTagName('a')[0].classList.remove('active');
        document.getElementById('element-options').getElementsByTagName('a')[0].classList.add('active');

        document.getElementsByClassName('wptb-elements-container')[0].style.display = 'none';
        document.getElementsByClassName('wptb-settings-section')[0].style.display = 'none';
        document.getElementById("element-options-group").style.display = 'block';

        var children = document.getElementById("element-options-group").childNodes;
        for (var i = 0; i < children.length; i++) {
            if (children[i].style) children[i].style.display = 'none';
        }

        document.querySelector(optionsClass).style.display = 'block';

        //var listStyleType, textAlign;

        //        switch (element.kind) {

        //            case 'text':
        //                jQuery(prop).find('[data-type=color]').wpColorPicker({ defaultColor: node.style.color });
        //                prop.querySelector('[type=number][data-type=font-size]').value
        //                    = prop.querySelector('[type=range][data-type=font-size]').value
        //                    = node.style.fontSize.substring(0, node.style.fontSize.length - 2);
        //                break;
        //            case 'list':
        //                textAlign = node.querySelector('li p').style.textAlign;
        //                listStyleType = node.querySelector('li').style.listStyleType;
        //                if ( prop.querySelector( 'select[data-type=list-class]' ) ) {
        //                console.log(textAlign);
        //                console.log(listStyleType);
        //                console.log(listStyleType);
        //                console.log(prop);
        //                    prop.querySelector('select[data-type=list-class]').selectedIndex = ( listStyleType == 'decimal' ? 0 : 1 );
        //                }
        //                if ( prop.querySelector('select[data-type=list-style-type]') ) {
        //                    prop.querySelector('select[data-type=list-style-type]').selectedIndex = (listStyleType == 'circle' ? 0 : (listStyleType == 'square' ? 1 : 2));
        //                }
        //                if ( prop.querySelector('select[data-type=list-alignment]') ) {
        //                    prop.querySelector('select[data-type=list-alignment]').selectedIndex = (textAlign == 'left' ? 0 : (textAlign == 'center' ? 1 : 2));
        //                }
        //                break;
        //            case 'image':
        //                break;
        //            case 'button':
        //                jQuery(prop).find('[data-type=button-color]').wpColorPicker({ defaultColor: node.style.backgroundColor });
        //                break;
        //
        //        }
    };

    if (element.kind == 'button') {
        //We must add this special kind of property, since it is triggered with click event
        var buttons = prop.getElementsByClassName('wptb-btn-size-btn');

        for (var i = 0; i < buttons.length; i++) {
            buttons[i].onclick = function () {
                var size = this.innerHTML,
                    n_Class = this.dataset.element,
                    infArr = n_Class.match(/wptb-options-(.+)-(\d+)/i),
                    type = infArr[1],
                    num = infArr[2],
                    affectedEl = document.getElementsByClassName('wptb-element-' + type + '-' + num)[0];
                affectedEl.classList.remove('wptb-size-S');
                affectedEl.classList.remove('wptb-size-M');
                affectedEl.classList.remove('wptb-size-L');
                affectedEl.classList.remove('wptb-size-XL');
                affectedEl.classList.add('wptb-size-' + size);
                var b = this.parentNode.getElementsByClassName('wptb-btn-size-btn');
                for (var i = 0; i < b.length; i++) {
                    b[i].classList.remove('selected');
                }
                this.classList.add('selected');
            };
        }
    }

    var optionControls = prop.getElementsByClassName('wptb-element-property');

    for (var i = 0; i < optionControls.length; i++) {
        if (optionControls[i].classList.contains('wptb-color-picker')) {
            jQuery(optionControls[i]).wpColorPicker({
                change: function change(event, ui) {
                    var parent = event.target,
                        classe,
                        type,
                        ps,
                        number;
                    classe = parent.dataset.element.match(/wptb-options-(.+)-(\d+)/i);
                    type = classe[1];
                    number = classe[2];
                    affectedEl = document.getElementsByClassName('wptb-element-' + type + '-' + number)[0];
                    if (type == 'button') {
                        if (parent.dataset.type == 'button-text-color') {
                            affectedEl.getElementsByClassName('wptb-button')[0].style.color = ui.color.toString();
                        } else {
                            affectedEl.getElementsByClassName('wptb-button')[0].style.backgroundColor = ui.color.toString();
                        }
                    } else {
                        affectedEl.style.color = ui.color.toString();
                    }
                }
            });
        }

        if (optionControls[i].dataset.type === 'font-size') {
            var slider = optionControls[i].parentNode.parentNode.getElementsByClassName('wptb-text-font-size-slider')[0];
            slider.oninput = function () {
                this.parentNode.parentNode.getElementsByClassName('wptb-text-font-size-number')[0].value = this.value;
                this.parentNode.parentNode.getElementsByClassName('wptb-text-font-size-number')[0].onchange();
            };
        }

        if (optionControls[i].dataset.type === 'image-size') {
            var slider = optionControls[i].parentNode.parentNode.getElementsByClassName('wptb-image-size-slider')[0];
            slider.oninput = function () {
                this.parentNode.parentNode.getElementsByClassName('wptb-image-width-number')[0].value = this.value;
                this.parentNode.parentNode.getElementsByClassName('wptb-image-width-number')[0].onchange();
            };
        }

        optionControls[i].onchange = function (event) {

            var n_Class = this.dataset.element,
                infArr = n_Class.match(/wptb-options-(.+)-(\d+)/i),
                type = infArr[1],
                num = infArr[2],
                affectedEl = document.getElementsByClassName('wptb-element-' + type + '-' + num)[0],
                val = this.value;

            switch (this.dataset.type) {
                case 'src':
                    var img = affectedEl.getElementsByTagName("img")[0];
                    img.src = this.value;
                    break;
                case 'alternative-text':
                    var img = affectedEl.getElementsByTagName('img')[0];
                    img.alt = this.value;
                    break;
                case 'image-link':
                    affectedEl.getElementsByTagName('a')[0].href = this.value;
                    break;
                case 'image-link-target':
                    if (this.checked == true) {
                        affectedEl.getElementsByTagName('a')[0].target = '_blank';
                    } else {
                        affectedEl.getElementsByTagName('a')[0].target = '_self';
                    }
                    break;
                case 'image-size':
                    affectedEl.getElementsByTagName('img')[0].style.width = this.value + '%';
                    affectedEl.getElementsByTagName('img')[0].style.height = 'auto';
                    this.parentNode.parentNode.getElementsByClassName('wptb-image-size-slider')[0].value = this.value;
                    break;
                case 'image-alignment':
                    affectedEl.getElementsByTagName('img')[0].parentNode.style.textAlign = this.value;
                    break;
                case 'font-size':
                    affectedEl.style.fontSize = val + 'px';
                    break;
                case 'button-alignment':
                    var jc = '';
                    if (this.value == 'left') {
                        jc = 'start';
                    } else if (this.value == 'right') {
                        jc = 'flex-end';
                    } else {
                        jc = 'center';
                    }
                    affectedEl.getElementsByClassName('wptb-button-wrapper')[0].style.justifyContent = jc;
                    break;
                case 'button-link':
                    affectedEl.getElementsByTagName('a')[0].href = this.value;
                    break;
                case 'button-link-target':
                    if (this.checked == true) {
                        affectedEl.getElementsByTagName('a')[0].target = '_blank';
                    } else {
                        affectedEl.getElementsByTagName('a')[0].target = '_self';
                    }
                    break;
                case 'button-color':
                    break;
                case 'list-alignment':
                    var listItems = affectedEl.querySelectorAll('li');
                    for (var i = 0; i < listItems.length; i++) {
                        var _p = listItems[i].querySelector('p');
                        if (_p) {
                            _p.style.textAlign = this.value;
                        }
                    }
                    break;
                case 'list-class':
                    var parentNode = event.target.parentNode.parentNode.querySelector('[data-type=list-style-type]').parentNode,
                        parentNodeSettingItem = parentNode.parentNode;
                    if (val == 'unordered') {
                        parentNode.style.display = 'flex';

                        parentNodeSettingItem.querySelector('.wptb-list-icon-select-label').style.display = 'flex';
                        var _listItem = affectedEl.querySelectorAll('li');
                        for (var i = 0; i < _listItem.length; i++) {
                            _listItem[i].style.listStyleType = 'disc';
                        }
                        parentNodeSettingItem.querySelector('[data-type=list-style-type]').value = 'disc';
                    } else {
                        parentNode.style.display = 'none';
                        parentNodeSettingItem.querySelector('.wptb-list-icon-select-label').style.display = 'none';
                        var listItem = affectedEl.querySelectorAll('li');
                        for (var i = 0; i < listItem.length; i++) {
                            listItem[i].style.listStyleType = 'decimal';
                        }
                    }
                    break;
                case 'list-style-type':
                    var listItem = affectedEl.querySelectorAll('li');
                    for (var i = 0; i < listItem.length; i++) {
                        listItem[i].style.listStyleType = val.toLowerCase();
                    }
                    break;
            }
        };
    }
};
var WPTB_Image = function WPTB_Image(src, DOMElementProt) {
    var DOMElement = void 0,
        kindIndexProt = undefined,
        copy = false;
    if (DOMElementProt == undefined) {
        DOMElement = document.createElement('div');
        var anchor = document.createElement('a'),
            img = document.createElement('img');
        anchor.style.display = 'inline-block';
        anchor.appendChild(img);
        DOMElement.appendChild(anchor);

        anchor.onclick = function (e) {
            e.preventDefault();
        };

        file_frame = wp.media.frames.file_frame = wp.media({
            title: 'Select a image to upload',
            button: {
                text: 'Use this image'
            },
            multiple: false
        });
        // When an image is selected, run a callback.
        file_frame.on('select', function () {
            attachment = file_frame.state().get('selection').first().toJSON();
            img.src = attachment.url;
        });
        // Finally, open the modal
        if (src == undefined) {
            file_frame.open();
        } else {
            img.src = src;
        }
    } else {
        DOMElement = DOMElementProt.cloneNode(true);

        DOMElement.getElementsByTagName('a')[0].onclick = function (e) {
            e.preventDefault();
        };

        var wptbElementMutch = DOMElementProt.className.match(/wptb-element-((.+-)\d+)/i);
        if (wptbElementMutch && Array.isArray(wptbElementMutch)) {
            kindIndexProt = wptbElementMutch[1];
            copy = true;
        };
    }

    this.kind = 'image';
    this.getDOMElement = function () {
        return DOMElement;
    };
    applyGenericItemSettings(this, kindIndexProt, copy);

    return this;
};
var WPTB_Initializer = function WPTB_Initializer() {

        var MIN_COLUMNS = 1,
            MIN_ROWS = 1,
            MAX_COLUMNS = 10,
            MAX_ROWS = 10;

        var tableGenerator = document.body;
        columnsDecrementButton = tableGenerator.getElementsByClassName('wptb-input-number-decrement')[0], columnsIncrementButton = tableGenerator.getElementsByClassName('wptb-input-number-increment')[0], rowsDecrementButton = tableGenerator.getElementsByClassName('wptb-input-number-decrement')[1], rowsIncrementButton = tableGenerator.getElementsByClassName('wptb-input-number-increment')[1], columnsInput = document.getElementById('wptb-columns-number'), rowsInput = document.getElementById('wptb-rows-number');

        columnsDecrementButton.onclick = function () {
                if (columnsInput.value > MIN_COLUMNS) {
                        columnsInput.value--;
                }
        };

        columnsIncrementButton.onclick = function () {
                if (columnsInput.value < MAX_COLUMNS) {
                        columnsInput.value++;
                }
        };

        rowsDecrementButton.onclick = function () {
                if (rowsInput.value > MIN_ROWS) {
                        rowsInput.value--;
                }
        };

        rowsIncrementButton.onclick = function () {
                if (rowsInput.value < MAX_ROWS) {
                        rowsInput.value++;
                }
        };

        document.getElementById('wptb-generate-table').onclick = function () {
                var columns = document.getElementById('wptb-columns-number').value,
                    rows = document.getElementById('wptb-rows-number').value;

                WPTB_Table(columns, rows);
        };
};
var WPTB_LeftPanel = function WPTB_LeftPanel() {

    var table = document.getElementsByClassName('wptb-preview-table')[0],
        wptbElementButtons = document.getElementsByClassName('wptb-element');

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 'rgb(' + parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16) + ')' : null;
    }

    function RgbToHex(rgb) {
        var rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);

        return rgb && rgb.length === 4 ? "#" + ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
    };

    function wptbTdBgColorSavedSet(inputId, trNumber) {
        if (trNumber > 3) return;
        var tableRows = table.getElementsByTagName('tr');
        if (tableRows.length > trNumber) {
            var td = tableRows[trNumber].querySelector('td');
            if (td) {
                var tdBackgroundColor = td.style.backgroundColor;
                var wptbEvenRowBg = document.getElementById(inputId);
                if (wptbEvenRowBg && tdBackgroundColor) {
                    wptbEvenRowBg.value = tdBackgroundColor;
                }
            }
        }
    }

    wptbTdBgColorSavedSet('wptb-even-row-bg', 1);
    jQuery('#wptb-even-row-bg').wpColorPicker({
        change: function change(event, ui) {
            var tableRows = table.getElementsByTagName('tr');
            for (var i = 1; i < tableRows.length; i += 2) {
                tds = tableRows[i].getElementsByTagName('td');
                for (var j = 0; j < tds.length; j++) {
                    tds[j].style.backgroundColor = ui.color.toString();
                }
            }
        }
    });

    wptbTdBgColorSavedSet('wptb-odd-row-bg', 2);
    jQuery('#wptb-odd-row-bg').wpColorPicker({
        change: function change(event, ui) {
            var tableRows = table.getElementsByTagName('tr');
            for (var i = 2; i < tableRows.length; i += 2) {
                tds = tableRows[i].getElementsByTagName('td');
                for (var j = 0; j < tds.length; j++) {
                    tds[j].style.backgroundColor = ui.color.toString();
                }
            }
        }
    });

    wptbTdBgColorSavedSet('wptb-table-header-bg', 0);
    jQuery('#wptb-table-header-bg').wpColorPicker({
        change: function change(event, ui) {
            var tableHeader = table.getElementsByTagName('tr')[0],
                tds = tableHeader.getElementsByTagName('td');
            for (var j = 0; j < tds.length; j++) {
                tds[j].style.backgroundColor = ui.color.toString();
            }
        }
    });

    function tableBorderColorWidthSavedSet() {
        var table = document.getElementsByClassName('wptb-preview-table');
        if (table.length > 0) {
            var tableBorderColor = table[0].style.borderColor;
            if (tableBorderColor) {
                var tableBorderColorInput = document.getElementById('wptb-table-border-color');
                if (tableBorderColorInput) {
                    tableBorderColorInput.value = tableBorderColor;
                }
            }

            var tableBorderWidth = table[0].style.borderWidth;
            if (tableBorderWidth) {
                var wptbTableBorderWidthSlider = document.getElementById('wptb-table-border-slider'),
                    wptbTableBorderWidthNumber = document.getElementById('wptb-table-border-number');

                if (wptbTableBorderWidthSlider) {
                    wptbTableBorderWidthSlider.value = parseInt(tableBorderWidth);
                }
                if (wptbTableBorderWidthNumber) {
                    wptbTableBorderWidthNumber.value = parseInt(tableBorderWidth);
                }
            }

            var tableTd = table[0].querySelector('td');
            if (tableTd) {
                var applyInnerBorder = tableTd.style.borderWidth;
                if (applyInnerBorder && parseInt(applyInnerBorder) > 0) {
                    var innerBorderCheckInput = document.getElementById('wptb-inner-border-check');
                    if (innerBorderCheckInput) {
                        innerBorderCheckInput.checked = true;
                    }
                }
            }
        }
    }

    tableBorderColorWidthSavedSet();

    jQuery('#wptb-table-border-color').wpColorPicker({
        change: function change(event, ui) {
            var tableCells = table.getElementsByTagName('td');
            table.style.border = document.querySelector('#wptb-table-border-number').value + 'px solid ' + ui.color.toString();

            for (var i = 0; i < tableCells.length; i++) {
                var tableInnerborderNumber = document.querySelector('#wptb-table-inner-border-number').value;
                if (document.getElementById('wptb-inner-border-check').checked) {
                    tableCells[i].style.border = (tableInnerborderNumber != 0 ? tableInnerborderNumber : 1) + 'px solid ' + ui.color.toString();
                }
            }
        }
    });

    function addInnerBorderSize(value) {
        var tableCells = table.getElementsByTagName('td');
        for (var i = 0; i < tableCells.length; i++) {
            tableCells[i].style.border = document.querySelector('#wptb-table-inner-border-number').value + 'px solid ' + hexToRgb(jQuery('#wptb-table-border-color').val());
        }
    }

    function addCellPadding(value) {
        var tableCells = table.getElementsByTagName('td');
        for (var i = 0; i < tableCells.length; i++) {
            tableCells[i].style.padding = value + 'px';
        }
    }

    function addInnerBorder(checked) {
        var styles,
            color = document.querySelector('#wptb-table-border-color').value != undefined ? document.querySelector('#wptb-table-border-color').value : 'rgb(0,0,0)';

        if (checked == 'checked') {
            document.getElementById('wptb-apply-inner-border').style.marginBottom = '0px';
            var tableCells = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
            for (var i = 0; i < tableCells.length; i++) {
                tableCells[i].style.border = '1px solid ' + color;
            }
            document.getElementById('wptb-inner-border-settings').classList.add('visible');
        } else {
            document.getElementById('wptb-inner-border-settings').classList.remove('visible');
            var tableCells = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
            for (var i = 0; i < tableCells.length; i++) {
                tableCells[i].style.border = '0px solid ' + color;
            }
        }
    }

    function addBorderSize(value) {
        table.style.borderWidth = value + 'px';
        table.style.borderStyle = 'solid';
    }

    function cellPaddingSavedSet() {
        var table = document.getElementsByClassName('wptb-preview-table');

        if (table.length > 0) {
            var td = table[0].querySelector('td');

            if (td) {
                var padding = td.style.padding;

                if (padding) {
                    var wptbTableCellSlider = document.getElementById('wptb-table-cell-slider'),
                        wptbTableCellNumber = document.getElementById('wptb-table-cell-number');

                    if (wptbTableCellSlider) {
                        wptbTableCellSlider.value = parseInt(padding);
                    }
                    if (wptbTableCellNumber) {
                        wptbTableCellNumber.value = parseInt(padding);
                    }
                }
            }
        }
    }

    cellPaddingSavedSet();

    document.getElementById('wptb-table-cell-slider').oninput = function () {
        document.getElementById('wptb-table-cell-number').value = this.value;
        addCellPadding(this.value);
    };

    document.getElementById('wptb-table-cell-number').onchange = function () {
        document.getElementById('wptb-table-cell-slider').value = this.value;
        addCellPadding(this.value);
    };

    document.getElementById('wptb-table-border-slider').oninput = function () {
        document.getElementById('wptb-table-border-number').value = this.value;
        addBorderSize(this.value);
    };

    document.getElementById('wptb-table-border-number').onchange = function () {
        document.getElementById('wptb-table-border-slider').value = this.value;
        addBorderSize(this.value);
    };

    document.getElementById('wptb-table-inner-border-slider').oninput = function () {
        document.getElementById('wptb-table-inner-border-number').value = this.value;
        addInnerBorderSize(this.value);
    };

    document.getElementById('wptb-table-inner-border-number').onchange = function () {
        document.getElementById('wptb-table-inner-border-slider').value = this.value;
        addInnerBorderSize(this.value);
    };

    document.getElementById('wptb-inner-border-check').onchange = function () {
        var _val = this.checked ? 'checked' : 'unchecked';
        addInnerBorder(_val);
    };

    for (var i = 0; i < wptbElementButtons.length; i++) {
        wptbElementButtons[i].ondragstart = function (e) {
            e.dataTransfer.setData('wptbElement', this.dataset.wptbElement);
        };
    }

    document.getElementById('wptb-activate-cell-management-mode').onclick = table.toggleTableEditMode;
    document.getElementById('wptb-add-end-row').onclick = table.addRowToTheEnd;
    document.getElementById('wptb-add-start-row').onclick = table.addRowToTheStart;
    document.getElementById('wptb-add-row-before').onclick = table.addRowBefore;
    document.getElementById('wptb-add-row-after').onclick = table.addRowAfter;
    document.getElementById('wptb-add-end-column').onclick = table.addColumnEnd;
    document.getElementById('wptb-add-start-column').onclick = table.addColumnStart;
    document.getElementById('wptb-add-column-before').onclick = table.addColumnBefore;
    document.getElementById('wptb-add-column-after').onclick = table.addColumnAfter;
    document.getElementById('wptb-delete-column').onclick = table.deleteColumn;
    document.getElementById('wptb-delete-row').onclick = table.deleteRow;
    document.getElementById('wptb-merge-cells').onclick = table.mergeCells;
    document.getElementById('wptb-split-cell').onclick = table.splitCell;
    document.getElementById('add-elements').onclick = function () {
        document.getElementById('element-options').getElementsByTagName('a')[0].classList.remove('active');
        document.getElementById('add-elements').getElementsByTagName('a')[0].classList.add('active');
        document.getElementsByClassName('wptb-elements-container')[0].style.display = 'table';
        document.getElementsByClassName('wptb-settings-section')[0].style.display = 'block';
        document.getElementById("element-options-group").style.display = 'none';
    };
};
var WPTB_List = function WPTB_List(innerElements, DOMElementProt) {

    var el_L = document.createElement('ul'),
        item,
        DOMElement = document.createElement('div'),
        kindIndexProt = undefined,
        copy = false;
    DOMElement.classList.add('wptb-list-item-container');

    this.kind = 'list';

    if (innerElements === '') {
        //Case for edit mode list
    } else if (!innerElements) {
        for (var i = 0; i < 3; i++) {
            item = new WPTB_ListItem('List Item ' + (i + 1));
            el_L.appendChild(item.getDOMElement());
        }
    } else {
        var wptbElementMutch = DOMElementProt.className.match(/wptb-element-((.+-)\d+)/i);
        if (wptbElementMutch && Array.isArray(wptbElementMutch)) {
            kindIndexProt = wptbElementMutch[1];
            copy = true;
        };

        for (var i = 0; i < innerElements.length; i++) {
            var listItem = DOMElementProt.querySelector('li');
            item = new WPTB_ListItem(innerElements[i], listItem, true);
            el_L.appendChild(item.getDOMElement());
        }
    }
    DOMElement.appendChild(el_L);
    //window.addElementOptions('list', elList);

    this.getDOMElement = function () {
        return DOMElement;
    };
    applyGenericItemSettings(this, kindIndexProt, copy);

    return this;
};
var WPTB_ListItem = function WPTB_ListItem(text, DOMElementProt, copy) {
    var wptbListItemReturn = void 0;
    if (DOMElementProt == undefined || DOMElementProt && copy) {
        if (text == undefined) text = 'New List Item';
        var DOMElement = document.createElement('li'),

        //divdot = document.createElement('div'),
        divcontent = document.createElement('div');
        //libullet = document.createElement('li');
        //divdot.classList.add('wptb-list-item-style-dot');
        divcontent.classList.add('wptb-list-item-content');
        //libullet.classList.add('wptb-bullet');
        if (DOMElementProt) {
            var styleDot = DOMElementProt.getAttribute('style');
            if (styleDot) {
                DOMElement.setAttribute('style', styleDot);
            }
        }
        //DOMElement.appendChild(divdot);
        DOMElement.appendChild(divcontent);
        //divdot.appendChild(libullet);
        divcontent.innerHTML = text;
        divcontent.onkeyup = window.listItemKeyListener;

        wptbListItemReturn = true;
    } else {
        var DOMElement = DOMElementProt;
        var divcontent = DOMElement.getElementsByClassName('wptb-list-item-content')[0];

        divcontent.onkeyup = window.listItemKeyListener;

        wptbListItemReturn = false;
    }

    DOMElement.onmouseenter = function (event) {

        var btnDelete = document.createElement('span'),
            btnCopy = document.createElement('span'),
            actions = document.createElement('span'),
            previous,
            i;
        actions.classList.add('wptb-actions');
        btnDelete.classList.add('dashicons', 'dashicons-trash', 'delete-action');
        btnCopy.classList.add('dashicons', 'dashicons-admin-page', 'duplicate-action');
        this.classList.add('wptb-directlyhovered');

        btnDelete.onclick = function () {
            var action = this.parentNode,
                item = this.parentNode.parentNode,
                parent = item.parentNode;
            item.removeChild(action);
            parent.removeChild(item);
        };

        btnCopy.onclick = function (event) {
            var listItem = event.target.parentNode.parentNode,
                content = listItem.querySelector('.wptb-list-item-content'),
                html = content.innerHTML;
            var duplicate = new WPTB_ListItem(html, listItem, true);
            listItem.parentNode.insertBefore(duplicate.getDOMElement(), DOMElement);
        };

        actions.append(btnCopy, btnDelete);
        this.appendChild(actions);
    };

    DOMElement.onmouseleave = function (event) {
        this.classList.remove('wptb-directlyhovered');
        var actions = this.parentNode.querySelector('.wptb-actions');
        if (actions != undefined) {
            var parent = actions.parentNode;
            parent.removeChild(actions);
        }
    };

    divcontent.onkeydown = function (event) {
        var key = event.which != undefined ? event.which : event.keyCode,
            article = event.target.parentNode,
            duplicate,
            lastP;
        if (key !== 13 || window.dontAddItems !== undefined && window.dontAddItems === true) {
            return;
        }
        event.preventDefault();
        duplicate = new WPTB_ListItem(this.innerHTML, article, true);
        DOMElement.parentNode.insertBefore(duplicate.getDOMElement(), DOMElement);
        setTimeout(function () {
            divcontent.innerHTML = 'New List Item';
        }, 5);

        return false;
    };

    this.getDOMElement = function () {
        return DOMElement;
    };

    if (wptbListItemReturn) {
        return this;
    }
};
var MultipleSelect = function MultipleSelect() {

	var selectedCells = [],
	    multipleCellMode = false;

	this.activateMultipleSelectMode = function () {
		selectedCells = [];
		var tds = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
		for (var i = 0; i < tds.length; i++) {
			tds[i].classList.remove('wptb-highlighted');
		}
		multipleCellMode = true;
	};

	this.deactivateMultipleSelectMode = function () {
		multipleCellMode = false;
	};

	this.isActivated = function () {
		return multipleCellMode;
	};

	this.pushSelectedCell = function (cell) {
		if (!multipleCellMode) {
			return;
		}
		selectedCells.push(cell);
		cell.classList.add('wptb-highlighted');
	};

	this.selectedCells = function () {
		return selectedCells;
	};

	this.flushSelectedCells = function () {
		selectedCells = [];
	};

	this.getFirst = function () {
		var minXIndex = 1000,
		    minYIndex = 1000,
		    first;
		for (var i = selectedCells.length - 1; i >= 0; i--) {
			if (minXIndex >= selectedCells[i].dataset.xIndex && minYIndex >= selectedCells[i].dataset.yIndex) {
				first = selectedCells[i];
				minXIndex = selectedCells[i].dataset.xIndex;
				minYIndex = selectedCells[i].dataset.yIndex;
			}
		}
		return first;
	};

	this.getLast = function () {
		var maxXIndex = -1,
		    maxYIndex = -1,
		    last;
		for (var i = selectedCells.length - 1; i >= 0; i--) {
			if (maxXIndex <= selectedCells[i].dataset.xIndex && maxYIndex <= selectedCells[i].dataset.yIndex) {
				last = selectedCells[i];
				maxXIndex = selectedCells[i].dataset.xIndex;
				maxYIndex = selectedCells[i].dataset.yIndex;
			}
		}
		return last;
	};

	this.removeAllButFirst = function () {
		var td = this.getFirst();
		for (var i = 1; i < selectedCells.length; i++) {
			selectedCells[i].classList.add('wptb-fused-cell-' + td.dataset.xIndex + '-' + td.dataset.yIndex);
		}
	};

	return this;
};
var WPTB_Parser = function WPTB_Parser(code) {
    if (Array.isArray(code)) {
        var elementHtml = void 0;

        if (code.length == 1) {
            return elementHtml.appendChild(document.createTextNode(code[0]));
        }
        if (0 in code) {
            var tagName = code[0];
            elementHtml = document.createElement(tagName);

            if (1 in code) {
                if (Array.isArray(code[1])) {
                    var attributes = code[1];

                    for (var i = 0; i < attributes.length; i++) {
                        if (Array.isArray(attributes[i])) {
                            elementHtml.setAttribute(attributes[i][0], attributes[i][1]);
                        }
                    }
                }
            }

            if (2 in code) {
                if (Array.isArray(code[2])) {
                    for (var _i = 0; _i < code[2].length; _i++) {
                        if (typeof code[2][_i] === 'string' && tagName.toLowerCase() == 'p') {
                            elementHtml.appendChild(document.createTextNode(code[2][_i]));
                            continue;
                        }
                        if (!WPTB_Parser(code[2][_i])) continue;
                        elementHtml.appendChild(WPTB_Parser(code[2][_i]));
                    }
                } else if (typeof code[2] === 'string') {
                    elementHtml.appendChild(document.createTextNode(code[2]));
                }
            }
        }

        return elementHtml;
    } else {
        return false;
    }
};
var WPTB_Settings = function WPTB_Settings() {

	var elems = document.getElementsByClassName('wptb-element');

	function detectMode() {
		var url = window.location.href,
		    regex = new RegExp('[?&]table(=([^&#]*)|&|#|$)'),
		    results = regex.exec(url);
		if (!results) return false;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}

	for (var i = 0; i < elems.length; i++) {
		elems[i].ondragstart = function (event) {
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('wptbElement', event.target.dataset.wptbElement);
		};
	};

	document.getElementsByClassName('wptb-save-btn')[0].onclick = function () {
		var http = new XMLHttpRequest(),
		    url = ajaxurl + "?action=save_table",
		    t = document.getElementById('wptb-setup-name').value.trim(),
		    messagingArea = void 0,
		    code = WPTB_Stringifier(document.getElementsByClassName('wptb-preview-table')[0], true);

		if (t === '') {
			messagingArea = document.getElementById('wptb-messaging-area');
			messagingArea.innerHTML = '<div class="wptb-error wptb-message">Error: You must assign a name to the table before saving it.</div>';
			messagingArea.classList.add('wptb-warning');
			setTimeout(function () {
				messagingArea.removeChild(messagingArea.firstChild);
			}, 4000);
			return;
		}
		code = JSON.stringify(code);
		var params = 'title=' + t + '&content=' + code;

		if ((rs = detectMode()) || (rs = document.wptbId)) {
			params += '&id=' + rs;
		}

		http.open('POST', url, true);
		http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		http.onreadystatechange = function (action) {
			if (this.readyState == 4 && this.status == 200) {

				var data = JSON.parse(http.responseText);
				messagingArea = document.getElementById('wptb-messaging-area');

				if (data[0] == 'saved') {
					document.wptbId = data[1];
					messagingArea.innerHTML = '<div class="wptb-success wptb-message">Table "' + t + '" was successfully saved.</div>';
				} else {
					messagingArea.innerHTML = '<div class="wptb-success wptb-message">Table "' + t + '" was successfully updated.</div>';
				}
				messagingArea.classList.add('wptb-success');
				setTimeout(function () {
					messagingArea.removeChild(messagingArea.firstChild);
				}, 4000);
			}
		};
		http.send(params);
	};
};
var WPTB_Space = function WPTB_Space(elSpaceBetween) {

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
    var spaceBetween = void 0;
    if (!elSpaceBetween) {
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
            element,
            t_space,
            spaceParent;

        while (!td.classList.contains('wptb-droppable')) {
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

    if (!elSpaceBetween) {
        return spaceBetween;
    }
};
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var WPTB_Stringifier = function WPTB_Stringifier(node) {
    var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


    if (node == undefined) {
        return '';
    } else if (node.tagName == undefined && node.nodeType == 3) {
        return node.nodeValue;
    }

    var code = [],
        children = void 0,
        int_elem_arr = false,
        attributes = [].concat(_toConsumableArray(node.attributes)),
        attributes_list = [],
        internal_elements = [];
    if ((node.parentNode.classList.contains('wptb-list-item-content') || node.parentNode.classList.contains('mce-content-body')) && node.tagName.toLowerCase() == 'p') {
        children = node.childNodes;
        int_elem_arr = true;
    } else if (node.children.length > 0) {
        children = node.children;
    } else {
        children = node.childNodes;
    }
    if (attributes.length > 0) {
        for (var i = 0; i < attributes.length; i++) {
            attributes_list[i] = [attributes[i].name, attributes[i].value];
        }
    } else {
        attributes_list = '';
    }

    if (children.length > 0) {
        for (var _i = 0; _i < children.length; _i++) {
            var inter_elem = WPTB_Stringifier(children[_i]);

            if (Array.isArray(inter_elem) || int_elem_arr) {
                internal_elements[_i] = inter_elem;
            } else if (typeof inter_elem === 'string' && inter_elem) {
                internal_elements = inter_elem;
            }
        }
    } else {
        internal_elements = '';
    }

    code.push(node.tagName.toLowerCase(), attributes_list, internal_elements);

    return code;
};
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var array = [],
    WPTB_Table = function WPTB_Table(columns, rows) {

	/* The members of the class */
	var settings = document.getElementsByClassName('wptb-settings-items'),
	    wptbTableSetup = document.getElementsByClassName("wptb-table-setup")[0],
	    table,
	    row,
	    cell,
	    maxAmountOfCells,
	    maxAmountOfRows;

	//HERE ARE THE PRIVATE FUNCTIONS
	/*
  * This function toggles buttons visibility in cell edit mode
  * (according to the amount of currently selected cells), and
  * highlights visually the clicked cell if it is not highlighted, or
  * removes highlight if clicked cell is already highlighted. 
  * It too toggles the bits of our abstract representation.
  * @param Event this is the event instance of the click performed over a cell.
  */
	var mark = function mark(event) {
		var rs = this.rowSpan,
		    cs = this.colSpan,
		    markedCells,
		    noCells = document.getElementsByClassName('no-cell-action'),
		    singleCells = document.getElementsByClassName('single-action'),
		    multipleCells = document.getElementsByClassName('multiple-select-action'),
		    position = getCoords(this),
		    row = position[0],
		    column = position[1];
		if (!document.select.isActivated()) {
			return;
		}
		if (this.className.match(/wptb-highlighted/)) {
			this.classList.remove('wptb-highlighted');
			for (var i = 0; i < rs; i++) {
				for (var j = 0; j < cs; j++) {
					array[row + i][column + j] = 0;
				}
			}
		} else {
			this.classList.add('wptb-highlighted');
			for (var i = 0; i < rs; i++) {
				for (var j = 0; j < cs; j++) {
					array[row + i][column + j] = 1;
				}
			}
		}

		markedCells = document.getElementsByClassName('wptb-highlighted').length;
		if (markedCells === 0) {
			for (var i = 0; i < multipleCells.length; i++) {
				multipleCells[i].classList.remove('visible');
			}
			for (var i = 0; i < noCells.length; i++) {
				noCells[i].classList.add('visible');
			}
			for (var i = 0; i < singleCells.length; i++) {
				singleCells[i].classList.remove('visible');
			}
		} else if (markedCells === 1) {
			for (var i = 0; i < multipleCells.length; i++) {
				multipleCells[i].classList.remove('visible');
			}
			for (var i = 0; i < noCells.length; i++) {
				noCells[i].classList.remove('visible');
			}
			for (var i = 0; i < singleCells.length; i++) {
				singleCells[i].classList.add('visible');
			}
		} else {
			for (var i = 0; i < multipleCells.length; i++) {
				if (table.isSquare(array)) {
					multipleCells[i].classList.add('visible');
				} else {
					multipleCells[i].classList.remove('visible');
				}
			}
			for (var i = 0; i < noCells.length; i++) {
				noCells[i].classList.remove('visible');
			}
			for (var i = 0; i < singleCells.length; i++) {
				singleCells[i].classList.remove('visible');
			}
		}
	};

	/* 
  * This function fills an array with 1's according to the actual design
  * of HTML table.
  * @returns an array of arrays containing an abstract representation
  * of HTML table.
  * @deprecated
  * */

	var realTimeArray = function realTimeArray() {
		var carried = [],
		    tds,
		    cols,
		    matriz = [];

		for (var i = 0; i < maxAmountOfCells; i++) {
			carried[i] = 0;
		}

		for (var i = 0; i < table.rows.length; i++) {
			cols = [];

			var tds = table.rows[i].getElementsByTagName('td');

			for (items = 0; items < tds.length; items++) {

				for (var k = 0; k < tds[items].colSpan; k++) {
					cols.push(1);
				}

				if (tds[items].rowSpan > 1) {
					for (var k = 0; k < tds[items].colSpan; k++) {
						carried[items + k] = {
							justAssigned: true,
							amount: tds[items].rowSpan
						};
					}
				}
			}

			for (var k = 0; k < maxAmountOfCells; k++) {
				if (_typeof(carried[k]) == 'object' && carried[k].amount > 0) {
					carried[k].amount--;
					if (carried[k].justAssigned) {
						carried[k].justAssigned = false;
					} else {
						cols.push(1);
					}
				}
			}

			matriz.push(cols);
		}
		return matriz;
	};

	/*
  * This function gets the number and position of cell spaces in current row that are occuped 
  * by upper rowspanned cells.
  * @param number the number of row where we wish to calculate the carried rowspans up to.
  * @return an array with the remaining rowspans in each column.
  */
	var carriedRowspans = function carriedRowspans(row) {
		var carried = [],
		    tds,
		    cols;

		for (var i = 0; i < maxAmountOfCells; i++) {
			carried[i] = 0;
		}

		if (row == -1) {
			return carried;
		}

		for (var i = 0; i <= row; i++) {
			cellsBuffer = table.rows[i].getElementsByTagName('td');
			cellPointer = 0;

			for (var xPosition = 0; xPosition < maxAmountOfCells; xPosition += stepsToMove) {
				stepsToMove = 1;

				if (carried[xPosition]) {
					carried[xPosition]--;
				} else {
					celda = cellsBuffer[cellPointer++];
					if (celda.rowSpan > 1) {
						for (k = 0; k < celda.colSpan; k++) {
							carried[xPosition + k] = celda.rowSpan - 1;
						}
						stepsToMove = celda.colSpan;
					} else if (celda.colSpan > 1) {
						stepsToMove = celda.colSpan;
					}
				}
			}
		}
		return carried;
	};

	/*
  * A helpful function for showing
  * the abstract table in console.
  * @param Array our abstract table.
  */
	var drawTable = function drawTable(a) {
		var string = 'DRAWING TABLE:\n';
		for (var i = 0; i < a.length; i++) {

			for (var j = 0; j < a[i].length; j++) {
				string += ' ' + a[i][j];
			}
			string += '\n';
		}
		table.isSquare(a);
	};

	/*
  * It resets all the bits of our abstract representation
  * to 0 and removes the highlighting class of all cells.
  */

	var undoSelect = function undoSelect() {
		var noCells = document.getElementsByClassName('no-cell-action'),
		    singleCells = document.getElementsByClassName('single-action'),
		    multipleCells = document.getElementsByClassName('multiple-select-action'),
		    tds = table.getElementsByClassName('wptb-highlighted');
		while (tds.length) {
			tds[0].classList.remove('wptb-highlighted');
		}
		for (var i = 0; i < array.length; i++) {
			for (var j = 0; j < array[i].length; j++) {
				array[i][j] = 0;
			}
		}
		for (var i = 0; i < multipleCells.length; i++) {
			multipleCells[i].classList.remove('visible');
		}
		for (var i = 0; i < noCells.length; i++) {
			noCells[i].classList.add('visible');
		}
		for (var i = 0; i < singleCells.length; i++) {
			singleCells[i].classList.remove('visible');
		}
	};

	/*
  * This fills the abstract representation of our table with 
  * zeros, at the start. the max amount of cells is the greatest sum
  * of all colspans for row.
  */

	var fillTableArray = function fillTableArray() {
		var colspansSums = [],
		    a = [];

		//calculate max amount of cells inside a row
		for (var i = 0; i < table.rows.length; i++) {
			var cells = table.rows[i].getElementsByTagName('td'),
			    colspanSumInRow = 0;
			for (var j = 0; j < cells.length; j++) {
				colspanSumInRow += cells[j].colSpan;
			}
			colspansSums.push(colspanSumInRow);
		}

		maxAmountOfCells = Math.max.apply(null, colspansSums);
		//calculate max rows
		var maxAmountOfRows = table.rows.length;

		// fill with zeros from both values
		for (var i = 0; i < maxAmountOfRows; i++) {
			a[i] = [];
			for (var j = 0; j < maxAmountOfCells; j++) {
				a[i].push(0);
			}
		}
		drawTable(a);
		return a;
	};

	/*
  * This function gets the sum of all colspans in a row.
  * @param number the number of row to be used as reference.
  */
	var getActualPointsInRow = function getActualPointsInRow(row) {
		var tds = table.rows[row].getElementsByTagName('td'),
		    points = 0;
		for (var i = 0; i < tds.length; i++) {
			points += tds[i].colSpan;
		}
		return points;
	};

	/*
  * This function gets us the exact coordinates of
  * an exact cell, in a more reliable way than xIndex and yIndex,
  * these last ones were meant to be used for getting the cell trough them.
  * @param DOMElement the cell to get the coordinates.
  */
	var getCoords = function getCoords(search) {
		var skipInCols = [],
		    cell;

		for (var i = 0; i < maxAmountOfCells; i++) {
			skipInCols[i] = 0;
		}

		for (var i = 0; i < table.rows.length; i++) {
			var cellsBuffer = table.rows[i].getElementsByTagName('td');
			cellPointer = 0;
			for (var xPosition = 0; xPosition < maxAmountOfCells; xPosition += stepsToMove) {
				stepsToMove = 1;

				if (skipInCols[xPosition]) {
					skipInCols[xPosition]--;
				} else {
					var td = cellsBuffer[cellPointer++];
					if (td == search) {
						return [i, xPosition];
					}
					if (td.rowSpan > 1) {
						for (k = 0; k < td.colSpan; k++) {
							skipInCols[xPosition + k] = td.rowSpan - 1;
						}
						stepsToMove = td.colSpan;
					} else if (td.colSpan > 1) {
						stepsToMove = td.colSpan;
					}
				}
			}
		}
	};

	jQuery('#wptb-table-header-bg').val('');
	jQuery('#wptb-even-row-bg').val('');
	jQuery('#wptb-odd-row-bg').val('');
	jQuery('#wptb-table-border-color').val('');
	jQuery('#wptb-table-inner-border-number,#wptb-table-inner-border-slider').val('0');
	jQuery('#wptb-table-border-number,#wptb-table-border-slider').val('0');
	jQuery('#wptb-table-padding-number,#wptb-table-padding-slider').val('15');

	if (columns || rows) {
		//END OF PRIVATE FUNCTIONS
		for (var i = 0; i < settings.length; i++) {
			if (settings[i].id !== 'wptb-apply-inner-border') {
				settings[i].classList.add('visible');
			}
		}

		//Create a HTML Table element.
		table = document.createElement('table');
		table.classList.add('wptb-preview-table');

		//Add the header row.
		row = table.insertRow(-1);
		row.classList.add('wptb-table-head', 'wptb-row');

		for (var i = 0; i < columns; i++) {
			cell = new WPTB_Cell(mark);
			cell.setCoords(0, i);
			row.appendChild(cell.getDOMElement());
		}

		//Add the data rows.
		for (var i = 1; i < rows; i++) {

			row = table.insertRow(-1);
			row.classList.add('wptb-row');

			for (var j = 0; j < columns; j++) {
				cell = new WPTB_Cell(mark);
				cell.setCoords(i, j);
				row.appendChild(cell.getDOMElement());
			}
		}
	} else {
		var wptb_preview_table = document.getElementsByClassName('wptb-preview-table');

		if (wptb_preview_table.length > 0) {
			table = wptb_preview_table[0];

			var cells = table.getElementsByTagName('td');

			if (cells.length > 0) {
				for (var _i = 0; _i < cells.length; _i++) {
					WPTB_Cell(mark, cells[_i]);
				}
			}
		}
	}

	/*
  * This just toggles visibility of cell edit bar, and toggles 
  * cell selecting mode.
  */

	table.toggleTableEditMode = function () {
		var bar = document.getElementById('edit-bar');
		if (bar.classList.contains('visible')) {
			document.select.deactivateMultipleSelectMode();
			bar.classList.remove('visible');
		} else {
			document.select.activateMultipleSelectMode();
			bar.classList.add('visible');
		}
	};

	/*
  * For assigning to each cell xIndex and y Index attributes,
  * these are the column number and row number of cell in table. 
  */

	table.recalculateIndexes = function () {
		var trs = this.getElementsByTagName('tr'),
		    tds,
		    maxCols = 0;

		for (var i = 0; i < trs.length; i++) {
			tds = trs[i].getElementsByTagName('td');
			for (var j = 0; j < tds.length; j++) {

				if (i == 0) {
					tds[j].parentNode.className = '';
					tds[j].style.backgroundColor = jQuery('#wptb-table-header-bg').val();
					tds[j].parentNode.classList.add('wptb-row', 'wptb-table-head');
				} else {
					if (i % 2 == 0) {
						tds[j].style.backgroundColor = jQuery('#wptb-odd-row-bg').val();
					} else {
						tds[j].style.backgroundColor = jQuery('#wptb-even-row-bg').val();
					}
					tds[j].parentNode.className = '';
					tds[j].parentNode.classList.add('wptb-row');
				}

				tds[j].dataset.xIndex = j;
				tds[j].dataset.yIndex = i;
			}
			if (j > maxCols) {
				maxCols = j;
			}
		}
		this.columns = maxCols;
	};

	/*
  * As simple as it is: adds a column to the end of table.
  */
	table.addColumnEnd = function () {
		var td = void 0,
		    currentTable = document.getElementsByClassName('wptb-preview-table'),
		    currentTableTd = void 0,
		    currentTdStyle = void 0;
		if (currentTable.length > 0) {
			currentTableTd = currentTable[0].querySelector('td');
		}

		if (currentTableTd) {
			currentTdStyle = currentTableTd.getAttribute('style');
		}
		for (var i = 0; i < table.rows.length; i++) {
			td = new WPTB_Cell(mark);
			if (currentTdStyle) {
				td.getDOMElement().setAttribute('style', currentTdStyle);
			}
			table.rows[i].appendChild(td.getDOMElement());
			array[i].push(0);
		}
		maxAmountOfCells++;
		table.recalculateIndexes();
		undoSelect();
	};

	/*
  * As simple as it looks: adds a column to the start of table.
  */

	table.addColumnStart = function () {
		var td = void 0,
		    firstCell = void 0,
		    currentTable = document.getElementsByClassName('wptb-preview-table'),
		    currentTableTd = void 0,
		    currentTdStyle = void 0;
		if (currentTable.length > 0) {
			currentTableTd = currentTable[0].querySelector('td');
		}

		if (currentTableTd) {
			currentTdStyle = currentTableTd.getAttribute('style');
		}
		for (var i = 0; i < table.rows.length; i++) {
			td = new WPTB_Cell(mark);
			if (currentTdStyle) {
				td.getDOMElement().setAttribute('style', currentTdStyle);
			}
			firstCell = table.rows[i].getElementsByTagName('td')[0];
			if (firstCell) {
				table.rows[i].insertBefore(td.getDOMElement(), firstCell);
			} else {
				table.rows[i].appendChild(td.getDOMElement());
			}
			array[i].push(0);
		}

		maxAmountOfCells++;
		table.recalculateIndexes();
		undoSelect();
	};

	/*
  * Well, not so simple as previous functions.
  * It adds a column after a certain column of reference.
  * @param integer the column number to be used as reference.
  *	If empty, then the first highlighted cell is used as reference.
  */

	table.addColumnAfter = function (c_pos) {
		var rows = table.rows,
		    cellPointer = void 0,
		    cellsBuffer = void 0,
		    cell = document.querySelector('.wptb-highlighted'),
		    cellStyle = cell.getAttribute('style'),
		    pos = c_pos != undefined && typeof c_pos === 'number' ? c_pos : getCoords(cell)[1],
		    pendingInsertion = false,
		    stepsToMove = void 0,
		    td = void 0,
		    bro = void 0,
		    carriedRowspans = [],
		    currentCell = void 0;

		for (var i = 0; i < maxAmountOfCells; i++) {
			carriedRowspans.push(0);
		}

		for (var i = 0; i < rows.length; i++) {
			cellPointer = 0;
			cellsBuffer = rows[i].getElementsByTagName('td');
			pendingInsertion = false;
			for (var xPosition = 0; xPosition < maxAmountOfCells; xPosition += stepsToMove) {
				stepsToMove = 1;

				if (pendingInsertion) {
					td = new WPTB_Cell(mark);
					if (cellStyle) {
						td.getDOMElement().setAttribute('style', cellStyle);
					}
					if (currentCell && rows[i].contains(currentCell)) {
						bro = currentCell.nextSibling;
						if (bro) {
							rows[i].insertBefore(td.getDOMElement(), bro);
						} else {
							rows[i].appendChild(td.getDOMElement());
						}
					} else {
						rows[i].insertBefore(td.getDOMElement(), cellsBuffer[0]);
					}
					break;
				} else if (carriedRowspans[xPosition] > 0) {
					// If no pending insertion, let's check if no rowspan from upper cells is pending in current position
					if (pos == xPosition) {
						pendingInsertion = true;
					}
				} else {
					currentCell = cellsBuffer[cellPointer++];
					if (currentCell.rowSpan > 1) {
						stepsToMove = currentCell.colSpan;
						for (var k = 0; k < currentCell.colSpan; k++) {
							carriedRowspans[xPosition + k] = currentCell.rowSpan;
							if (xPosition + k == pos) {
								pendingInsertion = true;
							}
						}
					} else if (currentCell.colSpan > 1) {
						stepsToMove = currentCell.colSpan;
						for (var k = 0; k < currentCell.colSpan; k++) {
							if (xPosition + k == pos) {
								pendingInsertion = true;
							}
						}
					} else if (xPosition == pos) {
						pendingInsertion = true;
					}
				}
			}

			for (var l = 0; l < maxAmountOfCells; l++) {
				if (carriedRowspans[l] > 0) carriedRowspans[l]--;
			}
		}

		for (var i = 0; i < array.length; i++) {
			array[i].push(0);
		}
		maxAmountOfCells++;
		drawTable(array);
		table.recalculateIndexes();
		undoSelect();
	};

	/*
  * For preventing us to take a lot of time,
  * This is just calling the function addColumnAfter, but
  * using the previous column to current one as reference.
  * @see addColumnAfter
  */

	table.addColumnBefore = function () {
		var cell = document.querySelector('.wptb-highlighted'),
		    pos = getCoords(cell)[1];

		if (pos === 0) {
			table.addColumnStart();
		} else {
			table.addColumnAfter(pos - 1);
		}
	};

	/*
  * Luckily, thisfunction is simple, 
  * it just add a row to the end of table.
  */

	table.addRowToTheEnd = function () {
		var r = table.insertRow(-1),
		    td = void 0,
		    aux = void 0,
		    currentTable = document.getElementsByClassName('wptb-preview-table'),
		    currentTableTd = void 0,
		    currentTdStyle = void 0;
		if (currentTable.length > 0) {
			currentTableTd = currentTable[0].querySelector('td');
		}

		if (currentTableTd) {
			currentTdStyle = currentTableTd.getAttribute('style');
		}

		for (var i = 0; i < maxAmountOfCells; i++) {
			td = new WPTB_Cell(mark);
			if (currentTdStyle) {
				td.getDOMElement().setAttribute('style', currentTdStyle);
			}
			r.appendChild(td.getDOMElement());
		}
		aux = Array.from(array[0]);
		array.push(aux);
		drawTable(array);
		table.recalculateIndexes();
		undoSelect();
	};

	/*
  * Yet another simple function, 
  * it just add a row to the start of table.
  */

	table.addRowToTheStart = function () {
		var r = table.insertRow(0),
		    td = void 0,
		    aux = void 0,
		    currentTable = document.getElementsByClassName('wptb-preview-table'),
		    currentTableTd = void 0,
		    currentTdStyle = void 0;
		if (currentTable.length > 0) {
			currentTableTd = currentTable[0].querySelector('td');
		}

		if (currentTableTd) {
			currentTdStyle = currentTableTd.getAttribute('style');
		}

		for (var i = 0; i < maxAmountOfCells; i++) {
			td = new WPTB_Cell(mark);
			if (currentTdStyle) {
				td.getDOMElement().setAttribute('style', currentTdStyle);
			}
			r.appendChild(td.getDOMElement());
		}
		aux = Array.from(array[0]);
		array.push(aux);
		drawTable(array);
		table.recalculateIndexes();
		undoSelect();
	};

	/* 
  * This function adds a row before the current one.
  * Since the biggest factor of problem is a not-started but ongoing rowspan,
  * the most of the troubles is not here.
  */

	table.addRowBefore = function () {
		var cell = document.querySelector('.wptb-highlighted'),
		    cellStyle = cell.getAttribute('style'),
		    row = getCoords(cell)[0],
		    r = table.insertRow(row),
		    aux,
		    rowspans = carriedRowspans(row - 1);

		noPending = rowspans.filter(function (elem) {
			return elem == 0;
		});

		for (var i = 0; i < noPending.length; i++) {
			var _td = new WPTB_Cell(mark);
			if (cellStyle) {
				_td.getDOMElement().setAttribute('style', cellStyle);
			}
			r.appendChild(_td.getDOMElement());
		}

		arr = realTimeArray();

		for (var i = 0; i < arr.length; i++) {

			if (arr[i].length > maxAmountOfCells) {
				//Still not watched
			}

			if (arr[i].length < maxAmountOfCells) {

				for (var j = arr[i].length; j < maxAmountOfCells; j++) {
					td = new WPTB_Cell(mark);
					table.rows[i].appendChild(td.getDOMElement());
				}
			}
		}

		aux = Array.from(array[0]);
		array.push(aux);
		drawTable(array);
		table.recalculateIndexes();
		undoSelect();
	};

	/*
  * Well... by the name convention of the previous 3 functions,
  * it's pretty obvious that this functions attaches a new
  * row after highlighted cell row. The greatest obstacle it was
  * the possibility of a TR not having the exact amount of columns
  * occuped by actual node but rowspanned upper cells. For that purpose
  * it was created the function realTimeArray.
  * @see realTimeArray
  */

	table.addRowAfter = function () {

		var cell = document.querySelector('.wptb-highlighted'),
		    cellStyle = cell.getAttribute('style'),
		    row = getCoords(cell)[0],
		    r = table.insertRow(row + 1),
		    aux,
		    rowspans = carriedRowspans(row);

		noPending = rowspans.filter(function (elem) {
			return elem == 0;
		});

		for (var i = 0; i < noPending.length; i++) {
			var _td2 = new WPTB_Cell(mark);
			if (cellStyle) {
				_td2.getDOMElement().setAttribute('style', cellStyle);
			}
			r.appendChild(_td2.getDOMElement());
		}

		arr = realTimeArray();

		for (var i = 0; i < arr.length; i++) {

			if (arr[i].length > maxAmountOfCells) {
				//Still not watched
			}

			if (arr[i].length < maxAmountOfCells) {

				for (var j = arr[i].length; j < maxAmountOfCells; j++) {
					td = new WPTB_Cell(mark);
					table.rows[i].appendChild(td.getDOMElement());
				}
			}
		}

		aux = Array.from(array[0]);
		array.push(aux);
		drawTable(array);
		table.recalculateIndexes();
		undoSelect();
	};

	/*
  * This function checks the current selected cells
  * make a rectangular shape.
  * @param Array the abstract table.
  * @return false, if not making a rectangle, or
  *	Array an array containing number of rows and columns, if selection makes a rectangle.
  */

	table.isSquare = function (a) {
		var rowStart = -1,
		    columnStart = -1,
		    rowEnd = -1,
		    columnEnd = -1,
		    height,
		    width,
		    itemsEstimate = 0,
		    items = 0;

		for (var i = 0; i < a.length; i++) {
			for (var j = 0; j < a[i].length; j++) {
				if (a[i][j] == 1) {
					rowStart = i;
					columnStart = j;
					break;
				}
			}
			if (rowStart !== -1 && columnStart !== -1) {
				break;
			}
		}

		for (var i = a.length - 1; i > -1; i--) {
			for (var j = a[i].length - 1; j > -1; j--) {
				if (a[i][j] == 1) {
					rowEnd = i;
					columnEnd = j;
					break;
				}
			}
			if (rowEnd !== -1 && columnEnd !== -1) {
				break;
			}
		}

		for (var i = rowStart; i < rowEnd; i++) {
			for (var j = columnStart; j < columnEnd; j++) {
				if (a[i][j] == 0 || a[i][j] == undefined) {
					return false;
				}
			}
		}

		for (var i = 0; i < a.length; i++) {
			for (var j = 0; j < a[i].length; j++) {
				if (a[i][j] == 1) {
					items++;
				}
			}
		}

		height = rowEnd - rowStart + 1;
		width = columnEnd - columnStart + 1;
		itemsEstimate = height * width;

		if (itemsEstimate !== items) {
			return false;
		}
		return [height, width];
	};

	/*
  * This function merges all selected cells.
  * Well, actually sets the colspan and rowspan of first 
  * upper left  cell in selection and deletes the another selected cells.
  */

	table.mergeCells = function () {
		var dimensions = table.isSquare(array),
		    rowspan = dimensions[0],
		    colspan = dimensions[1],
		    first = document.querySelector('.wptb-highlighted'),
		    tds = [].slice.call(document.getElementsByClassName('wptb-highlighted'), 1);

		for (var i = 0; i < tds.length; i++) {
			var p = tds[i].parentNode;
			p.removeChild(tds[i]);
		}

		first.colSpan = colspan;
		first.rowSpan = rowspan;
		undoSelect();
	};

	/*
  * This functions makes the exact inverse as above.
  * It resets colspan and rowspan and appends 
  * the same amount in cells to the table.
  * @bug
  */

	table.splitCell = function () {
		var cell = document.getElementsByClassName('wptb-highlighted')[0],
		    rowspan = cell.rowSpan,
		    colspan = cell.colSpan;
		cell.rowSpan = 1;
		cell.colSpan = 1;
		table.addLackingCells();

		undoSelect();
	};

	/*
  * Searches for rowspanned cells up to row number meeting it.
  * @param number the number of row where the function
  * must search up to.
  */

	table.findRowspannedCells = function (row) {
		var array = [],
		    difference;
		actualPoints = getActualPointsInRow(row);
		if (actualPoints === maxAmountOfCells) {
			return [];
		}
		difference = maxAmountOfCells - actualPoints;

		for (var i = row - 1; i >= 0 && difference; i--) {
			var tds = table.rows[i].getElementsByTagName('td');
			for (var i = 0; i < tds.length; i++) {
				if (tds[i].rowSpan > 1) {
					array.push(tds[i]);
					difference -= tds[i].colSpan;
				}
			}
		}
		return array;
	};

	/*
  * This function explores the table and adds 
  * a cell for each lacking one for each row
  * to meet an even amount of cells.
  */

	table.addLackingCells = function () {
		var sumRows = [];
		for (var i = 0; i < table.rows.length; i++) {
			sumRows.push(0);
		}

		for (var i = 0; i < table.rows.length; i++) {
			var tds = table.rows[i].getElementsByTagName('td');
			for (var j = 0; j < tds.length; j++) {
				if (tds[j].rowSpan > 1) {
					for (var k = 1; k < tds[j].rowSpan; k++) {
						sumRows[i + k]++;
					}
				}
			}
		}

		for (var i = 0; i < table.rows.length; i++) {
			var tds = table.rows[i].getElementsByTagName('td'),
			    totalColspan = 0;
			for (var j = 0; j < tds.length; j++) {
				totalColspan += tds[j].colSpan;
			}
			totalColspan += sumRows[i];
			difference = maxAmountOfCells - totalColspan;
			for (var j = 0; j < difference; j++) {
				var td = new WPTB_Cell(mark);
				table.rows[i].appendChild(td.getDOMElement());
			}
		}
	};

	/*
  * This function deletes the row of currently
  * selected cell. 
  */

	table.deleteRow = function () {

		var cell = document.querySelector('.wptb-highlighted'),
		    row = getCoords(cell)[0],
		    reduct = table.findRowspannedCells(row);

		for (i = 0; i < reduct.length; i++) {
			reduct[i].rowSpan--;
		}

		table.getElementsByTagName('tbody')[0].removeChild(table.rows[row]);
		array.pop();
		undoSelect();
		table.addLackingCells();
	};

	/*
  * This function deletes the column of currently
  * selected cell. Again, this is way more complicated than
  * delete row case.
  */

	table.deleteColumn = function () {

		var cell_ref = document.querySelector('.wptb-highlighted'),
		    column = getCoords(cell_ref)[1],
		    buffer,
		    cell,
		    carriedRowspans = [];

		for (var i = 0; i < maxAmountOfCells; i++) {
			carriedRowspans.push(0);
		}

		for (var i = 0; i < table.rows.length; i++) {
			buffer = table.rows[i].getElementsByTagName('td');
			stepsToMove = 1;
			cellPointer = 0;
			for (var j = 0; j < maxAmountOfCells; j += stepsToMove) {

				stepsToMove = 1;

				if (carriedRowspans[j] == 0) {
					cell = buffer[cellPointer++];
					if (cell.rowSpan > 1) {
						stepsToMove = cell.colSpan;
						for (var k = 0; k < cell.colSpan; k++) {
							carriedRowspans[j + k] = cell.rowSpan;
						}
						if (column > j && column <= j + k - 1) {
							//cell.style.backgroundColor = 'pink';
							cell.colSpan--;
							break;
						}
					} else if (cell.colSpan > 1) {
						stepsToMove = cell.colSpan;

						if (column > j && column <= j + cell.colSpan - 1) {
							//cell.style.backgroundColor = 'pink';
							cell.colSpan--;
							break;
						}
					}
					{
						if (column == j) {
							table.rows[i].removeChild(cell);
							//cell.style.backgroundColor = 'pink';
							break;
						}
					}
				} else {
					continue;
				}
			}

			for (var l = 0; l < carriedRowspans.length; l++) {
				if (carriedRowspans[l] > 0) {
					carriedRowspans[l]--;
				}
			}
		}
		maxAmountOfCells--;

		for (var i = 0; i < table.rows.length; i++) {
			if (array[i] != undefined) array[i].pop();
		}
		undoSelect();
	};

	document.getElementsByClassName('wptb-table-generator')[0].style.display = 'none';

	array = fillTableArray();

	undoSelect();
	drawTable(array);

	wptbTableSetup.appendChild(table);
	if (columns || rows) {
		table.recalculateIndexes();
	}

	WPTB_LeftPanel();
};
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var WPTB_Text = function WPTB_Text(text, DOMElementProt) {
    var DOMElement = document.createElement('div'),
        elText2 = document.createElement('div'),
        elP = document.createElement('p'),
        kindIndexProt = undefined,
        copy = false;

    elText2.classList.add('editable');
    elP.innerHTML = text != undefined ? text : 'Text';
    elText2.appendChild(elP);
    DOMElement.appendChild(elText2);
    if (DOMElementProt) {
        var wptbElementMutch = DOMElementProt.className.match(/wptb-element-((.+-)\d+)/i);
        if (wptbElementMutch && Array.isArray(wptbElementMutch)) {
            kindIndexProt = wptbElementMutch[1];
            copy = true;
        };

        var attributes = [].concat(_toConsumableArray(DOMElementProt.attributes));
        for (var i = 0; i < attributes.length; i++) {
            DOMElement.setAttribute(attributes[i].name, attributes[i].value);
        }
    }

    this.kind = 'text';
    this.getDOMElement = function () {
        return DOMElement;
    };
    applyGenericItemSettings(this, kindIndexProt, copy);

    return this;
};
//# sourceMappingURL=admin.js.map
