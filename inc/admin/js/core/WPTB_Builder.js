(function () {
    var WPTB_Builder = function () {
        var table_id = WPTB_Helper.detectMode();
        if ( table_id ) {
            var http = new XMLHttpRequest(),
                urlSet = ajaxurl + "?action=get_table" + '&id=' + table_id;
            http.open('GET', urlSet, true);
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            http.onreadystatechange = function (d) {
                if (this.readyState == 4 && this.status == 200) {
                    var ans = JSON.parse(http.responseText);
                    document.getElementById('wptb-setup-name').value = ans[0];
                    
                    if( ans[1] ) {
                        document.getElementsByClassName('wptb-table-generator')[0].style.display = 'none';
                        let wptbTableSetupEl = document.getElementsByClassName('wptb-table-setup')[0];
                        wptbTableSetupEl.appendChild( WPTB_Parser( ans[1] ) );
                        
                        let body = document.getElementsByTagName('body')[0];
                        
                        if( ans[2] ) {
                            let elementsSettingTemplateJs = document.createElement( 'script' );
                            elementsSettingTemplateJs.setAttribute( 'type', 'text/html' );
                            elementsSettingTemplateJs.setAttribute( 'class', 'wptb-element-datas' );

                            elementsSettingTemplateJs.innerHTML = ans[2];

                            body.appendChild( elementsSettingTemplateJs );
                        }
                        
                        WPTB_Table();
                        WPTB_LeftPanel();
                        WPTB_Settings();
                        
                        let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                        wptbTableStateSaveManager.tableStateSet();
                    } else {
                        document.getElementsByClassName('wptb-table-generator')[0].style.display = 'table';
                    }
                    
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