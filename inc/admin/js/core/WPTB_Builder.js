(function () {
    var WPTB_Builder = function () {
        var url = window.location.href,
            regex = new RegExp('[?&]newtable(=(1)|&|#|$)'),
            results = regex.exec(url);
        var table_id = WPTB_Helper.detectMode();
        if ( table_id && ( ! results || ! results[2] ) ) {
            var http = new XMLHttpRequest(),
                urlSet = ajaxurl + "?action=get_table" + '&id=' + table_id;
            http.open('GET', urlSet, true);
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            http.onreadystatechange = function (d) {
                if (this.readyState == 4 && this.status == 200) {
                    var ans = JSON.parse(http.responseText);
                    document.getElementById('wptb-setup-name').value = ans[0];
                    document.getElementsByClassName('wptb-table-generator')[0].style.display = 'none';
                    let wptbTableSetupEl = document.getElementsByClassName('wptb-table-setup')[0];

                    wptbTableSetupEl.appendChild( WPTB_Parser( ans[1] ) );
                    WPTB_Table();
                    WPTB_LeftPanel();
                    WPTB_Settings();
                    return;
                }
            };
            http.send(null);
        } else {
            document.getElementsByClassName('wptb-table-generator')[0].style.display = 'table';
        }
        document.counter = new ElementCounters();
        document.select = new MultipleSelect();

        var initializer = WPTB_Initializer();
        settings = WPTB_Settings();
    };

    document.addEventListener('DOMContentLoaded', WPTB_Builder);
})();