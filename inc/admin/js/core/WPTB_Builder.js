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
                    var ans = JSON.parse( http.responseText );
                    document.getElementById('wptb-setup-name').value = ans[0];
                        
                    if( ans[1] ) {
                        // @deprecated old generate logic
                        // document.getElementsByClassName('wptb-table-generator')[0].style.display = 'none';
                        let wptbTableSetupEl = document.getElementsByClassName('wptb-table-setup')[0];
                        wptbTableSetupEl.appendChild( WPTB_Parser( ans[1] ) );
                        
                        let body = document.getElementsByTagName('body')[0];
                        
                        WPTB_Table();
                        let element = document.querySelector( '.wptb-preview-table' );
                        if( element ) {
                            let infArr = element.className.match( /wptb-element-((.+-)\d+)/i );
                            if( ! infArr ) {
                                element.classList.add( 'wptb-element-main-table_setting-' + table_id );
                            }
                            
                            if( element.dataset.wptbTableContainerMaxWidth ) {
                                wptbTableSetupEl.style.maxWidth = element.dataset.wptbTableContainerMaxWidth + 'px';
                                
                                element.tdDefaultWidth();
                            }
                        }
                        
                        //WPTB_LeftPanel();
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
            // @deprecated old generate logic
            // document.getElementsByClassName('wptb-table-generator')[0].style.display = 'table';

            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
            wptbTableStateSaveManager.tableStateSet();
        }
        document.counter = new ElementCounters();
        document.select = new MultipleSelect();

        var initializer = WPTB_Initializer();
        settings = WPTB_Settings();
    };

    let url = window.location.href,
        regex = new RegExp('[?&]page=wptb-builder'),
        results = regex.exec( url );
    if ( results ) {
        document.addEventListener('DOMContentLoaded', WPTB_Builder);
    }
})();