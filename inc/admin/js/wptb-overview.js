(function () {
    let wptbButtonAddNew = document.getElementsByClassName( 'wptb-button-add-new' );
    if( wptbButtonAddNew.length > 0 ) {
        wptbButtonAddNew[0].onclick = function(e) {
            e.preventDefault();
            let http = new XMLHttpRequest(),
                url = ajaxurl + "?action=create_table";

            http.open('POST', url, true);
            http.setRequestHeader( 'Content-type', 'application/json; charset=utf-8' );

            http.onreadystatechange = function (action) {
                if ( this.readyState == 4 && this.status == 200 ) {
                    var data = JSON.parse( http.responseText );

                    if ( data[0] == 'created' ) {
                        let url = window.location.origin + window.location.pathname + '?page=wptb-builder&table=' + data[1] + '&newtable=1';
                        window.location.href = url;
                    }
                }
            }
            http.send();
        }
    }
})();