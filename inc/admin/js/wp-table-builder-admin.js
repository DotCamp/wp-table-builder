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

jQuery(document).ready(function($) {

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
                row.addClass('wptb-table-head');
            }

            //Add the data rows.
            for (var i = 1; i < rowCount; i++) {
                row = $(table[0].insertRow(-1));
                for (var j = 0; j < columnCount; j++) {
                    var cell = $("<td />");
                    row.append(cell);
                }
            }

            var wptbTable = $(".wptb-table-setup");
            wptbTable.html("");
            wptbTable.append(table);
        });
    });

});