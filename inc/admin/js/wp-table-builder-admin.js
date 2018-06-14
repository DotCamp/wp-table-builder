var wptbElement;

function init_tinymce() {
    tinyMCE.init({
        selector: '.editable',
        inline: true,
        menubar: false,
        theme: 'simple',
        toolbar: 'bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify ',
    });
}

jQuery(document).ready(function($) {
    
    //Increase/Decrease Rows and Columns Number.
    (function() {

        window.inputNumber = function(el) {
    
            var min = el.attr('min') || false;
            var max = el.attr('max') || false;
    
            var els = {};
    
            els.dec = el.prev();
            els.inc = el.next();
    
            el.each(function() {
                init($(this));
            });
    
            function init(el) {
    
                els.dec.on('click', decrement);
                els.inc.on('click', increment);

                els.dec.on('mousedown', function(e) {
                    e.preventDefault();
                });

                els.inc.on('mousedown', function(e) {
                    e.preventDefault();
                });
    
                function decrement() {
                    var value = el[0].value;
                    value--;
                    if (!min || value >= min) {
                        el[0].value = value;
                    }
                }
    
                function increment() {
                    var value = el[0].value;
                    value++;
                    if (!max || value <= max) {
                        el[0].value = value++;
                    }
                }
            }
        }
    })();

    //Column and Row number Selector.
    inputNumber(jQuery('#wptb-columns-number'));
    inputNumber(jQuery('#wptb-rows-number'));

    //Generate table and bind associated functions.
    $(function() {
        $("#wptb-generate-table").click(function() {

            $('.wptb-table-generator').hide();
            $('.wptb-settings-items').fadeIn();

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
                headerCell.addClass('wptb-droppable');  
                row.addClass('wptb-table-head');
            }

            //Add the data rows.
            for (var i = 1; i < rowCount; i++) {
                row = $(table[0].insertRow(-1));
                for (var j = 0; j < columnCount; j++) {
                    var cell = $("<td />"); 
                    cell.addClass('wptb-droppable');              
                    row.append(cell);
                }
            }

            //Appending the table to the container in UI
            var wptbTable = $(".wptb-table-setup");
            wptbTable.html("");
            wptbTable.append(table);

            //Adds/Removes Class to Droppable Cell when element enters.
            $('.wptb-droppable').bind('dragenter', function(event){
                event.target.classList.add('wptb-allow-drop');
                event.currentTarget.classList.add('wptb-allow-drop');
            });

            //Removes class when element is out of the droppable zone.
            $('.wptb-droppable').bind('dragleave', function(event){
                event.target.classList.remove('wptb-allow-drop');
            });

            //Allowing the drop
            $('.wptb-droppable').bind("dragover", function (event) {
                event.stopPropagation();
                event.preventDefault();
                return true;
            });

            //Text Element to be dropped in Cell.
            var elText = document.createElement('p');
            elText.classList.add('editable');
            elText.innerHTML = 'Text';

            //Runs when an element is dropped on a cell.
            $('.wptb-droppable').bind('drop', function(event){
                event.preventDefault();
                event.stopPropagation();
                event.target.classList.remove('wptb-allow-drop');
                if ( wptbElement == 'text' ) {
                    var textEl = elText.cloneNode(true);
                    event.target.appendChild(textEl);
                    init_tinymce();
                } else if ( wptbElement == 'image' ) {
                    event.target.innerHTML = 'Image';
                } else if ( wptbElement == 'button' ) {
                    event.target.innerHTML = 'Button';
                } else if ( wptbElement == 'list') {
                    event.target.innerHTML = 'List';
                }
            });

            //Triggers when table border setting changes.
            function addBorder(value) {
                var styles = {
                    border: value + 'px solid'
                };
                $('.wptb-preview-table').css(styles);
            }

            //Binds the range slider and input, also triggers table border change.
            $('#wptb-table-border-slider').bind('input change', function() {
                $('#wptb-table-border-number').val($(this).val());
                addBorder($(this).val());
            });

            //Binds the range slider and input, also triggers table border change.
            $('#wptb-table-border-number').bind('input change', function() {
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
            $('#wptb-table-cell-slider').bind('input change', function() {
                $('#wptb-table-cell-number').val($(this).val());
                addCellPadding($(this).val());
            });

            //Binds the range slider and input, also triggers cell padding change.
            $('#wptb-table-cell-number').bind('input change', function() {
                $('#wptb-table-cell-slider').val($(this).val());
                addCellPadding($(this).val());
            });

            //Triggers when apply inner border setting changes.
            function addInnerBorder(checked) {
                var styles; 
                
                if ( checked == 'checked' ) {
                    styles = {
                        border: 1 + 'px solid'
                    }
                    $('#wptb-apply-inner-border').css('margin-bottom', '0');
                    $('.wptb-preview-table td').css( styles );
                    $('#wptb-inner-border-settings').fadeIn();
                } else {
                    $('#wptb-inner-border-settings').fadeOut();
                    $('.wptb-preview-table td').css( 'border', '' );
                }
                
            }

            //Binding Checkbox Change, triggers inner border add.
            $('#wptb-inner-border-check').bind('change', function(){
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
            $('#wptb-table-inner-border-slider').bind('input change', function() {
                $('#wptb-table-inner-border-number').val($(this).val());
                addInnerBorderSize($(this).val());
            });

            //Binds the range slider and input, also triggers cell padding change.
            $('#wptb-table-inner-border-number').bind('input change', function() {
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
