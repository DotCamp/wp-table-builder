var wptbElement;

jQuery(document).ready(function ($) {

    //Column and Row number Selector.
    inputNumber(jQuery('#wptb-columns-number'));
    inputNumber(jQuery('#wptb-rows-number'));

    //Generate table and bind associated functions.
    $(function () {
        $("#wptb-generate-table").click(function () {

            $('.wptb-table-generator').hide();
            $('.wptb-settings-items').fadeIn();

            //Add Color Picker for Row and Header Background Colors
            $('#wptb-even-row-bg').wpColorPicker();
            $('#wptb-odd-row-bg').wpColorPicker();
            $('#wptb-table-header-bg').wpColorPicker();

            //Create a HTML Table element.
            var table = $("<table />");
            table.addClass('wptb-preview-table');

            //Get the count of columns and rows.
            var columnCount = parseInt($('#wptb-columns-number').val());
            var rowCount = parseInt($('#wptb-rows-number').val());

            //Add the header row.
            var row = $(table[0].insertRow(-1));
            for (var i = 0; i < columnCount; i++) {
                var headerCell = $("<td />");
                row.append(headerCell);
                headerCell.addClass('wptb-droppable wptb-cell');
                row.addClass('wptb-table-head wptb-row');
            }

            //Add the data rows.
            for (var i = 1; i < rowCount; i++) {
                row = $(table[0].insertRow(-1));
                for (var j = 0; j < columnCount; j++) {
                    var cell = $("<td />");
                    cell.addClass('wptb-droppable wptb-cell');
                    row.append(cell);
                    row.addClass('wptb-row')
                }
            }

            //Appending the table to the container in UI
            var wptbTable = $(".wptb-table-setup");
            wptbTable.html("");
            wptbTable.append(table);

            //Adds/Removes Class to Droppable Cell when element enters.
            $('.wptb-droppable').bind('dragenter', function (event) {
                event.target.classList.add('wptb-allow-drop');
                event.currentTarget.classList.add('wptb-allow-drop');
            });

            //Removes class when element is out of the droppable zone.
            $('.wptb-droppable').bind('dragleave', function (event) {
                event.target.classList.remove('wptb-allow-drop');
            });

            //Allowing the drop
            $('.wptb-droppable').bind("dragover", function (event) {
                event.stopPropagation();
                event.preventDefault();
                return true;
            });

            //Text Element to be dropped in Cell.
            var elText = document.createElement('div');
            var elText2 = document.createElement('div');
            elText2.classList.add('editable');
            var elP = document.createElement('p');
            elP.innerHTML = 'Text';
            elText2.appendChild(elP);
            elText.appendChild(elText2);

            //List Element to be dropped in Cell.
            var elList = document.createElement('div');
            //elList.classList.add('editable');
            var el_L = document.createElement('ul');
            el_L.innerHTML = "<article>\
                <div class=\"wptb-list-item-style-dot\">\
                    <li class=\"wptb-bullet\">\
                    </li>\
                </div>\
                <div class=\"wptb-list-item-content editable\" >List Item 1</div>\
            </article><article>\
                <div class=\"wptb-list-item-style-dot\">\
                    <li class=\"wptb-bullet\">\
                    </li>\
                </div>\
                <div class=\"wptb-list-item-content editable\" >List Item 2</div>\
            </article><article>\
                <div class=\"wptb-list-item-style-dot\">\
                    <li class=\"wptb-bullet\">\
                    </li>\
                </div>\
                <div class=\"wptb-list-item-content editable\" >List Item 3</div>\
            </article>";
            elList.appendChild(el_L);

            //Button Element to be dropped in Cell
            var elButton = document.createElement('div');
            elButton.classList.add('wptb-button-container');
            var elButton2 = document.createElement('div');
            elButton2.classList.add('wptb-button-wrapper');
            var el_B = document.createElement('p');
            el_B.classList.add('wptb-button');
            el_B.classList.add('editable');
            el_B.innerHTML = 'Button Text';
            elButton2.appendChild(el_B);
            elButton.appendChild(elButton2);

            //numbers of elements that have been added
            window.wptb_num = new Array();
            wptb_num["text"] = 0;
            wptb_num["image"] = 0;
            wptb_num["list"] = 0;
            wptb_num["button"] = 0;

            //Runs when an element is dropped on a cell.
            $('.wptb-droppable').bind('drop', function (event) {
                event.preventDefault();
                event.stopPropagation();
                event.target.classList.remove('wptb-allow-drop');
                if (wptbElement == 'text') {
                    var textEl = elText.cloneNode(true);
                    event.target.appendChild(textEl);


                    $(textEl).mouseenter(function (event) {
                        var btnDelete = $('<span class="dashicons dashicons-trash delete-action"></span>'),
                            btnCopy = $('<span class="dashicons dashicons-admin-page duplicate-action"></span>'),
                            actions = $('<span class="wptb-actions">Item Actions </span>');

                        $('.wptb-actions').remove();
                        $('.wptb-directlyhovered').removeClass('wptb-directlyhovered');
                        $(this).addClass('wptb-directlyhovered');

                        btnDelete.click(function () {
                            $(this).parent().parent().remove();
                        });
                        btnCopy.click(function () {
                            var duplicate = $(this).parent().parent().clone(true, true);
                            $(this).parent().parent().parent().append(duplicate);

                            /*************************************************
                             *            Give it separated options          *
                             *************************************************/
                            /**
                            * will carry the extracted infotrmation from the class
                            * @example class => wptb-ph-element wptb-element-text-0
                            *          result => [
                            *              0 => wptb-element-text-0
                            *              1 => text
                            *              2 => 0
                            *          ]
                            * @type array
                            */
                            var infArr = duplicate.attr('class').match(/wptb-element-(.+)-(\d)+/i),
                                wptbElement = infArr[1],
                                oldClass = infArr[0],
                                oldClassOption = "wptb-options-" + wptbElement + "-" + infArr[2],
                                classOption = ".wptb-element-options" +
                                    ".wptb-" + wptbElement + "-options" +
                                    "." + oldClassOption;
                            var duplicateOption = $(classOption).clone(true, true);
                            $(classOption).parent().append(duplicateOption);

                            // creating the new class name and deleting the old class 
                            var newClass = "wptb-element-" + wptbElement + "-" + wptb_num[wptbElement];
                            var newClassOption = "wptb-options-" + wptbElement + "-" + wptb_num[wptbElement];

                            duplicate.addClass(newClass);
                            duplicate.removeClass(oldClass);

                            duplicateOption.addClass(newClassOption);
                            duplicateOption.removeClass(oldClassOption);
                            wptb_num[wptbElement]++;

                            // Exceptions 
                            switch (wptbElement) {
                                case 'text':
                                    listener_to_element(duplicateOption.find('.wptb-color-picker'));
                                    duplicateOption.find('.wptb-color-picker').wpColorPicker();
                                    break;
                            }
                            duplicate[0].childNodes[0].id = '';
                            tinyFastCall(duplicate[0].childNodes[0]);
                        });

                        actions.append(btnCopy, btnDelete);
                        $(this).append(actions);

                    }).mouseleave(function (event) {
                        $(this).removeClass('wptb-directlyhovered');
                        $(this).find('.wptb-actions').remove();
                    });


                    tinyMCE.init({
                        target: textEl.childNodes[0],
                        inline: true,
                        plugins: "link",
                        dialog_type: "modal",
                        theme: 'modern',
                        menubar: false,
                        fixed_toolbar_container: '#wpcd_fixed_toolbar',
                        toolbar: 'bold italic strikethrough link unlink | alignleft aligncenter alignright alignjustify',
                    });

                    $(textEl).addClass('wptb-ph-element wptb-element-' + wptbElement + "-" + wptb_num[wptbElement]);

                    // adding element options
                    addElementOptions(wptbElement, textEl);
                    $(textEl).click();

                } else if (wptbElement == 'image') {
                    event.target.innerHTML = 'Image';
                } else if (wptbElement == 'button') {
                    // create the button element with text button
                    var button = elButton.cloneNode(true);

                    // this part is very important 
                    button.click(function (e) {
                        e.preventDefault();
                    });

                    $(button).mouseenter(function (event) {
                        var btnDelete = $('<span class="dashicons dashicons-trash delete-action"></span>'),
                            btnCopy = $('<span class="dashicons dashicons-admin-page duplicate-action"></span>'),
                            actions = $('<span class="wptb-actions">Item Actions </span>');

                        $('.wptb-actions').remove();
                        $('.wptb-directlyhovered').removeClass('wptb-directlyhovered');
                        $(this).addClass('wptb-directlyhovered');

                        btnDelete.click(function () {
                            $(this).parent().parent().remove();
                        });
                        btnCopy.click(function () {
                            var duplicate = $(this).parent().parent().clone(true, true);

                            var infArr = duplicate[0].className.match(/wptb-element-(.+)-(\d)+/i),
                                elName = infArr[1],
                                oldClass = infArr[0],
                                oldClassOptionsPanelClass = "wptb-options-" + elName + "-" + infArr[2];

                            var newOptionsPanel = $('.' + oldClassOptionsPanelClass).clone(true, true),
                                oldOptionsPanel = document.querySelector('.' + oldClassOptionsPanelClass);
                            oldOptionsPanel.parentNode.appendChild(newOptionsPanel[0]);

                            var newClass = "wptb-element-" + elName + "-" + wptb_num['button'];
                            var newClassOptionsPanelClass = "wptb-options-" + elName + "-" + wptb_num['button'];

                            duplicate[0].classList.add(newClass);
                            duplicate[0].classList.remove(oldClass);

                            newOptionsPanel.removeClass(oldClassOptionsPanelClass);
                            newOptionsPanel.addClass(newClassOptionsPanelClass);

                            wptb_num['button']++;

                            duplicate[0].id = '';
                            tinyFastCall(duplicate[0]);
                            $(this).parent().parent().parent().append(duplicate[0]);
                        });

                        actions.append(btnCopy, btnDelete);
                        $(this).append(actions);

                    }).mouseleave(function (event) {
                        $(this).removeClass('wptb-directlyhovered');
                        $(this).find('.wptb-actions').remove();
                    });
                    //append it to the cell
                    $(event.target).append(button);
                    console.log('Something', $(button).children().find('.wptb-button-wrapper'));
                    //using tinymce
                    tinyMCE.init({
                        target: button.childNodes[0],
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

                    //Give it a class That will help us to relate it to its properties
                    $(button).addClass('wptb-ph-element wptb-element-' + wptbElement + "-" + wptb_num[wptbElement]);

                    // To take a copy from the options prototype and relate it to the button
                    addElementOptions(wptbElement, button);

                    // click the element to show it's option to focus the page on it
                    $(button).click();

                } else if (wptbElement == 'list') {
                    var listEl = elList.cloneNode(true), contentCollection;

                    event.target.appendChild(listEl);

                    listEl.onmouseenter = showListSettings;
                    listEl.onmouseleave = hideListSettings;
                    contentCollection = listEl
                        .querySelectorAll('article .wptb-list-item-content');
                    for (var i = 0; i < contentCollection.length; i++) {
                        contentCollection[i].onmouseenter = showListItemSettings;
                        contentCollection[i].onmouseleave = hideListItemSettings;
                        contentCollection[i].onkeyup = listItemKeyListener;
                        tinyFastCall(contentCollection[i]);
                    }

                    listEl.classList.add('wptb-ph-element', 'wptb-element-' + wptbElement + "-" + wptb_num[wptbElement]);
                    addElementOptions(wptbElement, listEl);

                }
            });

            /**
             * adding Options to each element and related this option to it
             * by Class also give the element its events
             * 
             * @param {string} wptbElement name of the element
             * @param {opject} el the element itself
             * @returns {void}
             */
            function addElementOptions(wptbElement, el) {
                var prop = $(".wptb-" + wptbElement + "-options-prototype").clone();
                prop.removeClass("wptb-" + wptbElement + "-options-prototype"); // remove prototype from the class
                prop.addClass('wptb-options-' + wptbElement + "-" + wptb_num[wptbElement]);
                $("#element-options-group").append(prop);
                //special cases to elements if needed
                switch (wptbElement) {
                    case 'text':
                        listener_to_element(prop.find('.wptb-color-picker'));
                        prop.find('.wptb-color-picker').wpColorPicker();
                        break;
                }
                wptb_num[wptbElement]++;
            }

            /*
             * event click to the whole document and then check if it's to one
             * the created element to show it's option
             */
            $(document).bind('click', function (e) {
                var $this = $(e.target);
                var el_options = false; // this var will carry the element that will be shown its options

                //if($this.hasClass('wptb-element-options'))
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
                    $('.wptb-text-font-size-slider').bind('input change', function () {
                        $(this).parents('.wptb-settings-row').find('.wptb-text-font-size-number').val($(this).val());
                    });


                    //Binds the range slider and input for text font size.
                    $('.wptb-text-font-size-number').bind('input change', function () {
                        $(this).parents('.wptb-settings-row').find('.wptb-text-font-size-slider').val($(this).val());
                    });

                } else {
                    //show the add elements option
                    if ($this.is('#add-elements') ||
                        $this.parents('#add-elements').length !== 0 ||
                        $this.hasClass('wptb-builder-panel') ||
                        $this.parents('.wptb-builder-panel').length !== 0) {
                        add_Elements_tab();
                    }
                }
            });

            // active add Elements tab and it's options
            function add_Elements_tab() {

                $('.wptb-tab#element-options  a').removeClass('active');
                $('.wptb-tab#add-elements a').addClass('active');

                $('.wptb-elements-container').show();
                $('.wptb-settings-section').show();
                $("#element-options-group").hide();

            }

            // active Element options tab and it's options
            function Element_options_tab() {

                $('.wptb-tab#add-elements a').removeClass('active');
                $('.wptb-tab#element-options a').addClass('active');

                $('.wptb-elements-container').hide();
                $('.wptb-settings-section').hide();
                $("#element-options-group").show();

                //Hide all elements' options before showing the selected one
                $('#element-options-group').children().hide();

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
                    case 'list-class': if (val == 'unordered') {
                        $('[data-type=list-style-type]').parent().css('display', 'flex');
                        element.find('article .wptb-list-item-style-dot li').css('list-style-type', 'disc');
                        $('[data-type=list-style-type]').val('disc');
                    }
                    else {
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

            /**
             * to listen to the elements that will change dynamically
             * change by other javascript code then will trigger the change event to them
             * 
             * @param {string} element
             * @returns {void}
             */
            function listener_to_element(element) {
                element.data('old_value', element.val());
                window.setInterval(function () {
                    var value = element.val();
                    var old_value = element.data('old_value');
                    if (value != old_value) {
                        old_value = value;
                        element.trigger('change');
                    }
                }, 300);
            }

            //Triggers when table border setting changes.
            function addBorder(value) {
                var styles = {
                    border: value + 'px solid'
                };
                $('.wptb-preview-table').css(styles);
            }

            //Binds the range slider and input, also triggers table border change.
            $('#wptb-table-border-slider').bind('input change', function () {
                $('#wptb-table-border-number').val($(this).val());
                addBorder($(this).val());
            });

            //Binds the range slider and input, also triggers table border change.
            $('#wptb-table-border-number').bind('input change', function () {
                $('#wptb-table-border-slider').val($(this).val());
                addBorder($(this).val());
            });

            //Triggers when cell padding setting changes.
            function addCellPadding(value) {
                var styles = {
                    padding: value + 'px'
                };
                $('td').css(styles);
            }

            //Binds the range slider and input, also triggers cell padding change.
            $('#wptb-table-cell-slider').bind('input change', function () {
                $('#wptb-table-cell-number').val($(this).val());
                addCellPadding($(this).val());
            });

            //Binds the range slider and input, also triggers cell padding change.
            $('#wptb-table-cell-number').bind('input change', function () {
                $('#wptb-table-cell-slider').val($(this).val());
                addCellPadding($(this).val());
            });

            //Triggers when apply inner border setting changes.
            function addInnerBorder(checked) {
                var styles;

                if (checked == 'checked') {
                    styles = {
                        border: 1 + 'px solid'
                    }
                    $('#wptb-apply-inner-border').css('margin-bottom', '0');
                    $('.wptb-preview-table td').css(styles);
                    $('#wptb-inner-border-settings').fadeIn();
                } else {
                    $('#wptb-inner-border-settings').fadeOut();
                    $('.wptb-preview-table td').css('border', '');
                }

            }

            //Binding Checkbox Change, triggers inner border add.
            $('#wptb-inner-border-check').bind('change', function () {
                var _val = $(this).is(':checked') ? 'checked' : 'unchecked';
                addInnerBorder(_val);
            });

            //Triggers when cell padding setting changes.
            function addInnerBorderSize(value) {
                var styles = {
                    border: value + 'px solid'
                };
                $('.wptb-preview-table td').css(styles);
            }

            //Binds the range slider and input, also triggers cell padding change.
            $('#wptb-table-inner-border-slider').bind('input change', function () {
                $('#wptb-table-inner-border-number').val($(this).val());
                addInnerBorderSize($(this).val());
            });

            //Binds the range slider and input, also triggers cell padding change.
            $('#wptb-table-inner-border-number').bind('input change', function () {
                $('#wptb-table-inner-border-slider').val($(this).val());
                addInnerBorderSize($(this).val());
            });

        });

    });

    //When dragging starts for Text element
    function textDragStart(event) {
        wptbElement = 'text';
        var el = $(this);
        event.originalEvent.dataTransfer.effectAllowed = 'move';
        event.originalEvent.dataTransfer.setData("text/plain", event.target.getAttribute('id'));
    }

    //When dragging starts for Image element
    function imageDragStart(event) {
        wptbElement = 'image';
        var el = $(this);
        event.originalEvent.dataTransfer.effectAllowed = 'move';
        event.originalEvent.dataTransfer.setData("text/plain", event.target.getAttribute('id'));
    }

    //When dragging starts for Button element
    function buttonDragStart(event) {
        wptbElement = 'button';
        var el = $(this);
        event.originalEvent.dataTransfer.effectAllowed = 'move';
        event.originalEvent.dataTransfer.setData("text/plain", event.target.getAttribute('id'));
    }

    //When dragging starts for List element
    function listDragStart(event) {
        wptbElement = 'list';
        var el = $(this);
        event.originalEvent.dataTransfer.effectAllowed = 'move';
        event.originalEvent.dataTransfer.setData("text/plain", event.target.getAttribute('id'));
    }

    //On drag elements.
    $('#wptb-text').on('dragstart', textDragStart);
    $('#wptb-image').on('dragstart', imageDragStart);
    $('#wptb-button').on('dragstart', buttonDragStart);
    $('#wptb-list').on('dragstart', listDragStart);

});
