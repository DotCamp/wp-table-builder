var wptbElement;

//numbers of elements that have been added
window.wptb_num = new Array();
window.wptb_num["text"] = 0;
window.wptb_num["image"] = 0;
window.wptb_num["list"] = 0;
window.wptb_num["button"] = 0;

jQuery(document).ready(function ($) {

    //Column and Row number Selector.
    inputNumber(document.getElementById('wptb-columns-number'));
    inputNumber(document.getElementById('wptb-rows-number'));

    //document.getElementById('wptb_builder').onscroll = tryToChangeMCEWidth;

    //Generate table and bind associated functions.
    document.onready = function () {
        document.getElementById("wptb-generate-table").onclick = function () {

            document.getElementsByClassName('wptb-table-generator')[0].style.display = 'none';
            var settings = document.getElementsByClassName('wptb-settings-items');
            for (var i = 0; i < settings.length; i++) {
                settings[i].classList.add('visible');
            }

            //Add Color Picker for Row and Header Background Colors
            $('#wptb-even-row-bg').wpColorPicker();
            $('#wptb-odd-row-bg').wpColorPicker();
            $('#wptb-table-header-bg').wpColorPicker();

            //Create a HTML Table element.
            var table = document.createElement('table');
            table.classList.add('wptb-preview-table');

            //Get the count of columns and rows.
            var columnCount = parseInt(document.getElementById('wptb-columns-number').value);
            var rowCount = parseInt(document.getElementById('wptb-rows-number').value);

            //Add the header row.
            var row = table.insertRow(-1);
            for (var i = 0; i < columnCount; i++) {
                var headerCell = document.createElement("td");
                row.appendChild(headerCell);
                headerCell.classList.add('wptb-droppable', 'wptb-cell');
                row.classList.add('wptb-table-head', 'wptb-row');
            }

            //Add the data rows.
            for (var i = 1; i < rowCount; i++) {
                row = table.insertRow(-1);
                for (var j = 0; j < columnCount; j++) {
                    var headerCell = document.createElement("td");
                    headerCell.classList.add('wptb-droppable', 'wptb-cell');
                    row.appendChild(headerCell);
                    row.classList.add('wptb-row')
                }
            }

            //Appending the table to the container in UI
            var wptbTable = document.getElementsByClassName("wptb-table-setup")[0];
            wptbTable.innerHTML = '';
            wptbTable.appendChild(table);

            //Adds/Removes Class to Droppable Cell when element enters.
            var droppableItems = document.getElementsByClassName('wptb-droppable'),
                allowDrop = function (event) {
                    event.target.classList.add('wptb-allow-drop');
                    event.currentTarget.classList.add('wptb-allow-drop');
                    if (event.type == 'dragover') {
                        event.stopPropagation();
                        event.preventDefault();
                        return true;
                    }
                };

            for (var i = 0; i < droppableItems.length; i++) {
                droppableItems[i].ondragenter = allowDrop;
                droppableItems[i].ondragleave = function (event) {
                    event.target.classList.remove('wptb-allow-drop');
                };
                droppableItems[i].ondragover = allowDrop;
            }

            //Text Element to be dropped in Cell.
            var elList = window.newList();


            //Runs when an element is dropped on a cell.
            var drop = document.getElementsByClassName('wptb-droppable');
            for (i = 0; i < drop.length; i++) {
                drop[i].ondrop = function (event) {

                    event.preventDefault();
                    event.stopPropagation();
                    event.target.classList.remove('wptb-allow-drop');

                    if (wptbElement == 'text') {
                        var textEl = window.newText();
                        event.target.appendChild(textEl);
                        textEl.click();
                    } else if (wptbElement == 'image') {
                        event.target.innerHTML = 'Image';
                    } else if (wptbElement == 'button') {
                        var button = window.newButton();
                        event.target.appendChild(button);
                        button.click();
                    } else if (wptbElement == 'list') {
                        var listEl = window.newList();
                        event.target.appendChild(listEl);
                        listEl.click();
                    }
                }; //of drop
            };

            document.onkeydown = function (e) {
                if (e.target.className === 'mce-textbox') {
                    window.dontAddItems = true;
                    if (event.which === 13 || event.which === 27) {
                        setTimeout(function () {
                            window.dontAddItems = false;
                            document.querySelector('.wptb-list-item-content.mce-edit-focus').click();
                        }, 250);
                    }
                }
            };

            /*
             * event click to the whole document and then check if it's to one
             * the created element to show it's option
             */
            document.onclick = function (e) {
                setTimeout(
                    function () {
                        //window.tryToChangeMCEWidth();
                    }, 500);
                var $this = $(e.target);

                if (e.target.className.match(/delete-action/)) {
                    return;
                }
                if (e.target.id.match(/mceu_([0-9])*-button/)) {
                    window.dontAddItems = false;
                }

                var el_options = false; // this var will carry the element that will be shown its options

                // check if this element or one of it's parent should display its options
                if ($this.hasClass('wptb-ph-element')) {
                    el_options = $this;
                } else if ($this.parents().hasClass('wptb-ph-element')) {
                    el_options = $this.parents('.wptb-ph-element');
                }

                // check to show element's options
                if (el_options && el_options.length != 0) {
                    Element_options_tab();

                    /**
                     * will carry the extracted infotrmation from the class
                     * @example class => wptb-ph-element wptb-element-text-0
                     *          result => [
                     *              0 => wptb-element-text-0
                     *              1 => text-0
                     *              2 => text-
                     *          ]
                     * @type array
                     */
                    var infArr = el_options.attr('class').match(/wptb-element-((.+-)\d+)/i);

                    /*
                     * will carry the class name of the element's options
                     * @example wptb-text-options wptb-options-text-0
                     * @type String
                     */
                    var optionsClass = '.wptb-' + infArr[2] + 'options' +
                        '.wptb-options-' + infArr[1];
                    $(optionsClass).show();

                    //Binds the range slider and input for text font size.
                    var sliders = document.getElementsByClassName('wptb-text-font-size-slider');
                    for (var i = 0; i < sliders.length; i++) {
                        sliders[i].onchange = function () {
                            this.parentNode.parentNode.childNodes[3].childNodes[1].value = this.value;
                        }
                    }

                    //Binds the range slider and input for text font size.
                    var numbers = document.getElementsByClassName('wptb-text-font-size-number');
                    for (var i = 0; i < numbers.length; i++) {
                        numbers[i].onchange = function () {
                            this.parentNode.parentNode.childNodes[1].childNodes[1].value = this.value;
                        }
                    }
                } else {
                    //show the add elements option
                    if ($this.is('#add-elements') ||
                        $this.parents('#add-elements').length !== 0 ||
                        $this.hasClass('wptb-builder-panel') ||
                        $this.parents('.wptb-builder-panel').length !== 0) {
                        window.add_Elements_tab();
                    }
                }
            };

            // active Element options tab and it's options
            function Element_options_tab() {
                document.getElementById('add-elements').getElementsByTagName('a')[0].classList.remove('active');
                document.getElementById('element-options').getElementsByTagName('a')[0].classList.add('active');

                document.getElementsByClassName('wptb-elements-container')[0].style.display = 'none';
                document.getElementsByClassName('wptb-settings-section')[0].style.display = 'none';
                document.getElementById("element-options-group").style.display = 'block';
                var children = document.getElementById("element-options-group").childNodes;
                for (var i = 0; i < children.length; i++) {
                    if (children[i].style)
                        children[i].style.display = 'none';
                }
            }

            /**
             * this function will be called 
             * when a property of any elemnet is changed
             * to determine which element that we should edit
             * and then call edititng_property Function
             * @returns {void}
             */
            function detect_element_for_property() {
                var option = $(this);
                var parent = option.closest(".wptb-element-options");
                var classes = parent.attr("class");

                /**
                 * will carry the extracted infotrmation from the class
                 * @example class =>wptb-options-text-0
                 *          result => [
                 *              0 => wptb-options-text-0
                 *              1 => text
                 *              2 => 0
                 *          ]
                 * @type array
                 */
                var infArr = classes.match(/wptb-options-(.+)-(\d+)/i);

                var type = infArr[1];
                var num = infArr[2];
                var element = $('.wptb-ph-element.wptb-element-' + type + '-' + num);
                editing_property(element, option);
            }

            /**
             * will change the element according to the value of option
             * 
             * @param {object} element that will change according to the value of option
             * @param {object} option input element
             * @returns {void}
             */
            function editing_property(element, option) {
                // type of property @Ex: font-size,color ....
                var type = option.data('type');
                var val = option.val();
                switch (type) {
                    case 'font-size':
                        element.find("p").css('font-size', val + 'px');
                        break;
                    case 'color':
                        element.find("p").css('color', val);
                        break;
                    case 'list-class':
                        if (val == 'unordered') {
                            $('[data-type=list-style-type]').parent().css('display', 'flex');
                            element.find('article .wptb-list-item-style-dot li').css('list-style-type', 'disc');
                            $('[data-type=list-style-type]').val('disc');
                        } else {
                            $('[data-type=list-style-type]').parent().css('display', 'none');
                            element.find('article .wptb-list-item-style-dot li').css('list-style-type', 'decimal');
                        }
                        break;
                    case 'numbering-list-style-type':
                    case 'list-style-type':
                        element.find('article .wptb-list-item-style-dot li').css('list-style-type', val.toLowerCase());
                        break;
                }
            }
            $(document.body).on('change input, change select', '.wptb-element-property', detect_element_for_property);

            //Triggers when table border setting changes.
            function addBorder(value) {
                document.getElementsByClassName('wptb-preview-table')[0].style.border = value + 'px solid';
            }

            //Binds the range slider and input, also triggers table border change.
            document.getElementById('wptb-table-border-slider').onchange = function () {
                document.getElementById('wptb-table-border-number').value = this.value;
                addBorder(this.value);
            };

            //Binds the range slider and input, also triggers table border change.
            document.getElementById('wptb-table-border-number').onchange = function () {
                document.getElementById('wptb-table-border-slider').value = this.value;
                addBorder(this.value);
            };

            //Triggers when cell padding setting changes.
            function addCellPadding(value) {
                var tableCells = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
                for (var i = 0; i < tableCells.length; i++) {
                    tableCells[i].style.padding = value + 'px';
                }
            }

            //Binds the range slider and input, also triggers cell padding change.
            document.getElementById('wptb-table-cell-slider').onchange = function () {
                document.getElementById('wptb-table-cell-number').value = this.value;
                addCellPadding(this.value);
            };

            //Binds the range slider and input, also triggers cell padding change.
            document.getElementById('wptb-table-cell-number').onchange = function () {
                document.getElementById('wptb-table-cell-slider').value = this.value;
                addCellPadding(this.value);
            };

            //Triggers when apply inner border setting changes.
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

            //Binding Checkbox Change, triggers inner border add.
            document.getElementById('wptb-inner-border-check').onchange = function () {
                var _val = this.checked ? 'checked' : 'unchecked';
                addInnerBorder(_val);
            };

            //Triggers when cell padding setting changes.
            function addInnerBorderSize(value) {
                var tableCells = document.getElementsByClassName('wptb-preview-table')[0].getElementsByTagName('td');
                for (var i = 0; i < tableCells.length; i++) {
                    tableCells[i].style.border = value + 'px solid';
                }
            }

            //Binds the range slider and input, also triggers cell padding change.
            document.getElementById('wptb-table-inner-border-slider').onchange = function () {
                document.getElementById('wptb-table-inner-border-number').value = this.value;
                addInnerBorderSize(this.value);
            };

            //Binds the range slider and input, also triggers cell padding change.
            document.getElementById('wptb-table-inner-border-number').onchange = function () {
                document.getElementById('wptb-table-inner-border-slider').value = this.value;
                addInnerBorderSize(this.value);
            };

        };

    }; // Of document.onready

    //When dragging starts for Text element
    function itemDragStart(event) {
        wptbElement = event.target.id.substring(5, event.target.id.length);

        //var el = $(this);
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData("text/plain", event.target.getAttribute('id'));
    }

    //On drag elements.
    document.getElementById('wptb-text').ondragstart = itemDragStart;
    document.getElementById('wptb-image').ondragstart = itemDragStart;
    document.getElementById('wptb-button').ondragstart = itemDragStart;
    document.getElementById('wptb-list').ondragstart = itemDragStart;

});