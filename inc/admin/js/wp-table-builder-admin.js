var wptbElement;

jQuery(document).ready(function($) {
    
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

    inputNumber(jQuery('#wptb-columns-number'));
    inputNumber(jQuery('#wptb-rows-number'));

    $(function() {
        $("#wptb-generate-table").click(function() {

            $('.wptb-table-generator').hide();

            //Create a HTML Table element.
            var table = $("<table />");
            table[0].border = "0";
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

            var wptbTable = $(".wptb-table-setup");
            wptbTable.html("");
            wptbTable.append(table);

            $('.wptb-droppable').bind('dragenter', function(event){
                event.target.classList.add('wptb-allow-drop');
                event.currentTarget.classList.add('wptb-allow-drop');
            });

            $('.wptb-droppable').bind('dragleave', function(event){
                event.target.classList.remove('wptb-allow-drop');
            });

            $('.wptb-droppable').bind("dragover", function (event) {
                event.stopPropagation();
                event.preventDefault();
                return true;
            });

            $('.wptb-droppable').bind('drop', function(event){
                event.preventDefault();
                event.stopPropagation();
                event.target.classList.remove('wptb-allow-drop');
                if ( wptbElement == 'text' ) {
                    event.target.innerHTML = 'Text';
                } else if ( wptbElement == 'image' ) {
                    event.target.innerHTML = 'Image';
                } else if ( wptbElement == 'button' ) {
                    event.target.innerHTML = 'Button';
                } else if ( wptbElement == 'list') {
                    event.target.innerHTML = 'List';
                }
            });

        });
    });

    function textDragStart(event) {
        wptbElement = 'text';
        var el = $(this);
        event.originalEvent.dataTransfer.effectAllowed = 'move';
        event.originalEvent.dataTransfer.setData("text/plain", event.target.getAttribute('id'));
    }

    function imageDragStart(event) {
        wptbElement = 'image';
        var el = $(this);
        event.originalEvent.dataTransfer.effectAllowed = 'move';
        event.originalEvent.dataTransfer.setData("text/plain", event.target.getAttribute('id'));
    }

    function buttonDragStart(event) {
        wptbElement = 'button';
        var el = $(this);
        event.originalEvent.dataTransfer.effectAllowed = 'move';
        event.originalEvent.dataTransfer.setData("text/plain", event.target.getAttribute('id'));
    }

    function listDragStart(event) {
        wptbElement = 'list';
        var el = $(this);
        event.originalEvent.dataTransfer.effectAllowed = 'move';
        event.originalEvent.dataTransfer.setData("text/plain", event.target.getAttribute('id'));
    }

    $('#wptb-text').on('dragstart', textDragStart);
    $('#wptb-image').on('dragstart', imageDragStart);
    $('#wptb-button').on('dragstart', buttonDragStart);
    $('#wptb-list').on('dragstart', listDragStart);

});