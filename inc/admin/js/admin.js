var applyGenericItemSettings = function applyGenericItemSettings(element) {
	var node = element.getDOMElement(),
	    index = document.counter.nextIndex(element.kind),
	    listItems;

	node.onmouseenter = function (event) {
		this.classList.add('wptb-directlyhovered');
		var btnDelete = document.createElement('span'),
		    btnCopy = document.createElement('span'),
		    btnMove = document.createElement('span'),
		    actions = document.createElement('span'),
		    previous,
		    i;
		actions.classList.add('wptb-actions');
		btnDelete.classList.add('dashicons', 'dashicons-trash', 'delete-action');
		btnCopy.classList.add('dashicons', 'dashicons-admin-page', 'duplicate-action');
		btnMove.classList.add("dashicons", "dashicons-move", 'move-action');
		btnMove.draggable = true;
		btnDelete.onclick = function (event) {
			var act = this.parentNode.parentNode,
			    el = act.parentNode;
			el.removeChild(act);
		};
		//btnCopy.onclick = window.copyButton;
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
			console.log(img.src);
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
				setup: function setup(ed) {
					ed.on("init", function (ed) {
						tinyMCE.execCommand('mceRepaint');
					});
				},
				init_instance_callback: function init_instance_callback(editor) {
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
			for (var i = 0; i < listItems.length; i++) {
				tinyMCE.init({
					target: listItems[i],
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

	node.classList.add('wptb-ph-element', 'wptb-element-' + element.kind + '-' + index);

	new WPTB_ElementOptions(element, index);

	document.counter.increment(element.kind);
};

(function () {

	var WPTB_Builder = function WPTB_Builder() {
		document.counter = new ElementCounters();

		var initializer = WPTB_Initializer();
		settings = WPTB_Settings();
	};

	document.addEventListener('DOMContentLoaded', WPTB_Builder);
})();
var WPTB_Button = function WPTB_Button(text) {
        var DOMElement = document.createElement('div'),
            elButton2 = document.createElement('div'),
            el_B = document.createElement('p');

        this.kind = 'button';

        DOMElement.classList.add('wptb-button-container');
        elButton2.classList.add('wptb-button-wrapper');
        el_B.classList.add('wptb-button');
        el_B.classList.add('editable');
        el_B.innerHTML = text != undefined ? text : 'Button Text';
        elButton2.appendChild(el_B);
        DOMElement.appendChild(elButton2);

        this.getDOMElement = function () {
                return DOMElement;
        };

        applyGenericItemSettings(this);

        return this;
};
var WPTB_Cell = function WPTB_Cell(DOMElement) {

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

        DOMElement = document.createElement("td");

        DOMElement.classList.add('wptb-droppable', 'wptb-cell');

        DOMElement.onclick = function () {

                var relativeActions, cells;

                if (window._wptbManagementModeActive) {
                        return;
                }
                if (this.classList.contains('wptb-highlighted')) {
                        this.classList.remove('wptb-highlighted');
                } else {
                        relativeActions = document.getElementsByClassName('wptb-relative-action');
                        cells = document.getElementsByTagName('td');

                        for (var i = 0; i < relativeActions.length; i++) {
                                console.log(relativeActions[i]);
                                relativeActions[i].dataset.activeCell = this;
                        }

                        for (var i = 0; i < cells.length; i++) {
                                cells[i].classList.remove('wptb-highlighted');
                        }

                        this.classList.add('wptb-highlighted');
                }
        };

        DOMElement.ondragenter = function () {
                var div;
                this.classList.add('wptb-drop-here-empty');
        };

        DOMElement.ondragover = function (e) {
                e.preventDefault();
        };

        DOMElement.ondragleave = function () {
                this.classList.remove('wptb-drop-here-empty');
        };

        DOMElement.ondrop = function (e) {
                var element, classId;
                e.preventDefault();
                if (e.dataTransfer.getData('wptbElement')) {
                        element = newElementProxy(e.dataTransfer.getData('wptbElement'));
                        this.appendChild(element.getDOMElement());
                } else {
                        classId = e.dataTransfer.getData('node');
                        element = document.getElementsByClassName(classId)[0];
                        this.appendChild(element);
                }
                this.classList.remove('wptb-drop-here-empty');
                return true;
        };

        DOMElement.onmousedown = function () {};

        DOMElement.onmouseover = function () {};

        DOMElement.onmouseup = function () {};

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
var WPTB_ElementOptions = function WPTB_ElementOptions(element, index) {

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
    };

    var optionControls = prop.getElementsByClassName('wptb-element-property');
    console.log(optionControls);
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
                    console.log('Element', 'wptb-element-' + type + '-' + number);
                    affectedEl = document.getElementsByClassName('wptb-element-' + type + '-' + number)[0];
                    ps = affectedEl.getElementsByTagName("p");
                    for (var i = 0; i < ps.length; i++) {
                        ps[i].style.color = ui.color.toString();
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

        optionControls[i].onchange = function (event) {

            var n_Class = this.dataset.element,
                infArr = n_Class.match(/wptb-options-(.+)-(\d+)/i),
                type = infArr[1],
                num = infArr[2],
                affectedEl = document.getElementsByClassName('wptb-element-' + type + '-' + num)[0],
                val = this.value;

            console.log('Event triggered', this.dataset.type, this.value);

            switch (this.dataset.type) {
                case 'src':
                    var img = affectedEl.getElementsByTagName("img");
                    img.src = this.value;
                    break;
                    break;
                case 'alternative-text':
                    var img = affectedEl.getElementsByTagName("img");
                    img.alt = this.value;
                    break;
                case 'image-width':
                    var img = affectedEl.getElementsByTagName("img");
                    img.width = this.value + 'px';
                    break;
                    break;
                case 'image-height':
                    var img = affectedEl.getElementsByTagName("img");
                    img.height = this.value + 'px';
                    break;
                    break;
                case 'font-size':
                    var ps = affectedEl.getElementsByTagName("p");
                    for (var i = 0; i < ps.length; i++) {
                        ps[i].style.fontSize = val + 'px';
                    }

                    this.parentNode.parentNode.getElementsByClassName('wptb-text-font-size-slider')[0].value = this.value;

                    break;
                case 'color':
                    var ps = affectedEl.getElementsByTagName("p");
                    for (var i = 0; i < ps.length; i++) {
                        ps[i].style.color = val;
                    }
                    break;
                case 'list-class':
                    if (val == 'unordered') {
                        affectedEl.querySelector('[data-type=list-style-type]').parentNode.style.display = 'flex';
                        var bullets = element.querySelectorAll('article .wptb-list-item-style-dot li');
                        for (var i = 0; i < bullets.length; i++) {
                            bullets[i].style.listStyleType = 'disc';
                        }
                        document.querySelector('[data-type=list-style-type]').value = 'disc';
                    } else {
                        affectedEl.querySelector('[data-type=list-style-type]').parentNode.style.display = 'none';
                        var bullets = element.querySelectorAll('article .wptb-list-item-style-dot li');
                        for (var i = 0; i < bullets.length; i++) {
                            bullets[i].style.listStyleType = 'decimal';
                        }
                    }
                    break;
                case 'list-style-type':
                    var bullets = element.querySelectorAll('article .wptb-list-item-style-dot li');
                    for (var i = 0; i < bullets.length; i++) {
                        bullets[i].style.listStyleType = val.toLowerCase();
                    }
                    break;
            }
        };
    }
};
var WPTB_Image = function WPTB_Image(text) {
        var DOMElement = document.createElement('div'),
            img = document.createElement('img');

        this.kind = 'image';

        DOMElement.appendChild(img);

        this.getDOMElement = function () {
                return DOMElement;
        };
        applyGenericItemSettings(this);

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
        file_frame.open();

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
    }); //3MNRVA96 
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
    jQuery('#wptb-table-header-bg').wpColorPicker({
        change: function change(event, ui) {
            var tableHeader = table.getElementsByTagName('tr')[0],
                tds = tableHeader.getElementsByTagName('td');
            for (var j = 0; j < tds.length; j++) {
                tds[j].style.backgroundColor = ui.color.toString();
            }
        }
    });

    function addInnerBorderSize(value) {
        var tableCells = table.getElementsByTagName('td');
        for (var i = 0; i < tableCells.length; i++) {
            tableCells[i].style.border = value + 'px solid';
        }
    }

    function addCellPadding(value) {
        var tableCells = table.getElementsByTagName('td');
        for (var i = 0; i < tableCells.length; i++) {
            tableCells[i].style.padding = value + 'px';
        }
    }

    function addInnerBorder(checked) {
        var styles;

        if (checked == 'checked') {
            document.getElementById('wptb-apply-inner-border').style.marginBottom = '0px';
            var tableCells = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
            for (var i = 0; i < tableCells.length; i++) {
                tableCells[i].style.border = '1px solid';
            }

            document.getElementById('wptb-inner-border-settings').classList.add('visible');
        } else {
            document.getElementById('wptb-inner-border-settings').classList.remove('visible');
            var tableCells = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
            for (var i = 0; i < tableCells.length; i++) {
                tableCells[i].style.border = '';
            }
        }
    }

    function addBorderSize(value) {
        table.style.border = value + 'px solid';
    }

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

    document.getElementById('wptb-add-end-row').onclick = table.addRowToTheEnd;
    document.getElementById('wptb-add-start-row').onclick = table.addRowToTheStart;
    document.getElementById('wptb-add-row-before').onclick = table.addRowBefore;
    document.getElementById('wptb-add-row-after').onclick = table.addRowAfter;
    document.getElementById('wptb-add-end-column').onclick = table.addColumnToTheEnd;
    document.getElementById('wptb-add-start-column').onclick = table.addColumnToTheStart;
    document.getElementById('wptb-add-column-before').onclick = table.addColumnBefore;
    document.getElementById('wptb-add-column-after').onclick = table.addColumnAfter;
    document.getElementById('add-elements').onclick = function () {
        document.getElementById('element-options').getElementsByTagName('a')[0].classList.remove('active');
        document.getElementById('add-elements').getElementsByTagName('a')[0].classList.add('active');
        document.getElementsByClassName('wptb-elements-container')[0].style.display = 'table';
        document.getElementsByClassName('wptb-settings-section')[0].style.display = 'block';
        document.getElementById("element-options-group").style.display = 'none';
    };
};
var WPTB_List = function WPTB_List(innerElements) {
    var el_L = document.createElement('ul'),
        item,
        DOMElement = document.createElement('div');

    this.kind = 'list';

    if (!innerElements) for (var i = 0; i < 3; i++) {
        item = new WPTB_ListItem('List Item ' + (i + 1));
        el_L.appendChild(item.getDOMElement());
    } else {
        for (var i = 0; i < innerElements.length; i++) {
            item = new WPTB_ListItem(innerElements[i]);
            el_L.appendChild(item.getDOMElement());
        }
    }
    DOMElement.appendChild(el_L);
    //window.addElementOptions('list', elList);

    this.getDOMElement = function () {
        return DOMElement;
    };
    applyGenericItemSettings(this);

    return this;
};
var WPTB_ListItem = function WPTB_ListItem(text) {

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
            var item = this.parentNode.parentNode,
                parent = item.parentNode;
            parent.removeChild(item);
        };

        btnCopy.onclick = function (event) {
            var article = event.target.parentNode.parentNode,
                content = article.querySelector('.wptb-list-item-content'),
                html = content.innerHTML;
            var duplicate = new WPTB_ListItem(html);
            article.parentNode.appendChild(duplicate.getDOMElement());
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
            duplicate,
            lastP;
        if (key !== 13 || window.dontAddItems !== undefined && window.dontAddItems === true) {
            return;
        }
        event.preventDefault();
        duplicate = new WPTB_ListItem();
        if (DOMElement.nextSibling != undefined) {
            DOMElement.parentNode.insertBefore(duplicate.getDOMElement(), DOMElement.nextSibling);
        } else {
            DOMElement.parentNode.appendChild(duplicate.getDOMElement());
        }

        duplicate.getDOMElement().querySelector('.wptb-list-item-content').focus();

        lastP = this.childNodes[this.childNodes.length - 1];
        this.removeChild(lastP);
        if (this.innerHTML.trim() == '<p><br data-mce-bogus="1"></p>') {
            this.innerHTML = 'New List Item';
        }
        return false;
    };

    this.getDOMElement = function () {
        return DOMElement;
    };

    return this;
};
var WPTB_Settings = function WPTB_Settings() {

	var elems = document.getElementsByClassName('wptb-element');

	for (var i = 0; i < elems.length; i++) {
		elems[i].ondragstart = function (event) {
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData("text/plain", event.target.getAttribute('id'));
		};
	};

	document.getElementsByClassName('wptb-save-btn')[0].onclick = function () {
		var http = new XMLHttpRequest(),
		    url = ajaxurl + "?action=save_table",
		    t = document.getElementById('wptb-setup-name').value,
		    code = document.getElementsByClassName('wptb-table-setup')[0].innerHTML;
		console.log('Ajax called');
		var params = 'title=' + t + '&content=' + code;
		http.open('POST', url, true);
		http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		http.onreadystatechange = function (d) {
			if (this.readyState == 4 && this.status == 200) {
				alert('Table was saved successfully.' + d);
			}
		};
		http.send(params);
	};
};
var WPTB_Table = function WPTB_Table(columns, rows) {

		var settings = document.getElementsByClassName('wptb-settings-items'),
		    wptbTableSetup = document.getElementsByClassName("wptb-table-setup")[0],
		    table,
		    row,
		    cell;

		for (var i = 0; i < settings.length; i++) {
				settings[i].classList.add('visible');
		}

		document.getElementsByClassName('wptb-table-generator')[0].style.display = 'none';

		//Create a HTML Table element.
		table = document.createElement('table');
		table.classList.add('wptb-preview-table');

		//Add the header row.
		row = table.insertRow(-1);
		row.classList.add('wptb-table-head', 'wptb-row');

		for (var i = 0; i < columns; i++) {
				cell = new WPTB_Cell();
				cell.setCoords(0, i);
				row.appendChild(cell.getDOMElement());
		}

		//Add the data rows.
		for (var i = 1; i < rows; i++) {

				row = table.insertRow(-1);
				row.classList.add('wptb-row');

				for (var j = 0; j < columns; j++) {
						cell = new WPTB_Cell();
						cell.setCoords(i, j);
						row.appendChild(cell.getDOMElement());
				}
		}

		table.recalculateIndexes = function () {
				var trs = this.getElementsByTagName('tr'),
				    tds;

				for (var i = 0; i < trs.length; i++) {
						tds = trs[i].getElementsByTagName('td');
						for (var j = 0; j < tds.length; j++) {

								if (i == 0) {
										tds[j].parentNode.className = '';
										tds[j].parentNode.classList.add('wptb-row', 'wptb-table-head');
								} else {
										tds[j].parentNode.className = '';
										tds[j].parentNode.classList.add('wptb-row');
								}

								tds[j].dataset.xIndex = j;
								tds[j].dataset.yIndex = i;
						}
				}
		};

		table.addColumn = function (pos) {
				var referenceTd, newTd, _this;
				for (var i = 0; i < this.rows.length; i++) {

						var newTd = new WPTB_Cell();

						if (pos == 'before' || pos == 'after') {
								referenceTd = this.rows.getElementsByTagName('td')[_this.dataset.xIndex];
								if (pos == 'before') {
										this.rows[i].insertBefore(newTd.getDOMElement(), referenceTd);
										var buttons = document.getElementsByClassName('wptb-relative-action');
										for (var i = 0; i < buttons.length; i++) {
												buttons[i].dataset.xIndex++;
										}
								} else {
										this.rows[i].insertBefore(newTd.getDOMElement(), referenceTd.nextSibling);
								}
						} else if (pos == 'end') {
								this.rows[i].appendChild(newTd.getDOMElement());
						} else {
								this.rows[i].innerHTML = '<td class="wptb-droppable wptb-cell"></td>' + this.rows[i].innerHTML;
						}
				}

				this.recalculateIndexes();
		};

		table.addColumnToTheEnd = function (evt) {
				table.addColumn('end', this.dataset.activeCell);
		};

		table.addColumnToTheStart = function (evt) {
				table.addColumn('start', this.dataset.activeCell);
		};

		table.addColumnBefore = function () {
				table.addColumn('before', this.dataset.activeCell);
		};

		table.addColumnAfter = function () {
				table.addColumn('after', this.dataset.activeCell);
		};

		table.addRow = function (pos) {
				var _this,
				    row,
				    referenceRow = undefined;

				if (pos == 'end' || pos == 'start') {
						row = this.insertRow(pos == 'end' ? -1 : 0);
				} else {
						row = document.createElement('tr');
				}

				for (var j = 0; j < this.columns; j++) {
						var cell = new WPTB_Cell();
						row.appendChild(cell.getDOMElement());
				}

				row.classList.add('wptb-row');

				if (pos == 'before' || pos == 'after') {
						_this = this.getElementsByClassName('wptb-highlighted')[0];
						referenceRow = this.getElementsByTagName('tr')[_this.dataset.yIndex];
						if (pos == "before") {
								params.tbody.insertBefore(row, referenceRow);
								var buttons = document.getElementsByClassName('wptb-relative-action');
								for (var i = 0; i < buttons.length; i++) {
										buttons[i].dataset.yIndex++;
								}
						} else {
								this.getElementsByTagName('tbody')[0].insertBefore(row, referenceRow.nextSibling);
						}
				}

				if (pos == 'before' || pos == 'start') {
						var active = document.querySelector('wptb-highlighted');
						if (active) {
								active.onclick();
						}
				}

				this.recalculateIndexes();
		};

		table.addRowToTheEnd = function (evt) {
				table.addRow('end');
		};

		table.addRowToTheStart = function (evt) {
				table.addRow('start');
		};

		table.addRowBefore = function () {
				table.addRow('before');
		};

		table.addRowAfter = function () {
				table.addRow('after');
		};

		table.columns = columns;

		wptbTableSetup.appendChild(table);

		WPTB_LeftPanel();
};
var WPTB_Text = function WPTB_Text(text) {
        var DOMElement = document.createElement('div'),
            elText2 = document.createElement('div'),
            elP = document.createElement('p');

        this.kind = 'text';

        elText2.classList.add('editable');
        elP.innerHTML = text != undefined ? text : 'Text';
        elText2.appendChild(elP);
        DOMElement.appendChild(elText2);

        this.getDOMElement = function () {
                return DOMElement;
        };
        applyGenericItemSettings(this);

        return this;
};
//# sourceMappingURL=admin.js.map
