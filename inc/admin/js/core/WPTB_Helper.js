var WPTB_Helper = {
    hexToRgb: function( hex ) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
        return result ? 'rgb(' + parseInt( result[1], 16 ) + ',' + parseInt( result[2], 16 ) + ',' + parseInt( result[3], 16 ) + ')' : null;
    },
    rgbToHex: function ( rgb ) {
        var rgb = rgb.match( /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i );

        return ( rgb && rgb.length === 4 ) ? "#" +
            ( "0" + parseInt( rgb[1],10 ).toString( 16 )).slice( -2 ) +
            ( "0" + parseInt( rgb[2],10 ).toString( 16 )).slice( -2 ) +
            ( "0" + parseInt( rgb[3],10 ).toString( 16 )).slice( -2 ) : '';
    },
    getDragImageCustom: function ( type ) {
        let hostName = location.protocol + '//' + location.hostname;
        let img = document.createElement( 'img' );
        img.src = hostName + '/wp-content/plugins/wp-table-builder/inc/admin/views/builder/icons/' + type + '.png';
        return img;
    },
    dragImagesArr: function() {
        return {
            text: WPTB_Helper.getDragImageCustom( 'text' ),
            image: WPTB_Helper.getDragImageCustom( 'image' ),
            button: WPTB_Helper.getDragImageCustom( 'button' ),
            list: WPTB_Helper.getDragImageCustom( 'list' )
        };
    },
    listItemsRecalculateIndex: function( ulElem ) {
        let par = ulElem.querySelectorAll( 'p' );
        if ( par.length > 0 ) {
            for ( let i = 0; i < par.length; i++ ) {
                par[i].dataset.listStyleTypeIndex = Number( i ) + 1 + '.';
            }
        }
    },
    listItemsTinyMceInit: function( listItem ) {
        tinyMCE.init({
            target: listItem,
            inline: true,
            plugins: "link, paste",
            dialog_type: "modal",
            theme: 'modern',
            menubar: false,
            fixed_toolbar_container: '#wpcd_fixed_toolbar',
            paste_as_text: true,
            toolbar: 'bold italic strikethrough link unlink | alignleft aligncenter alignright alignjustify',
            init_instance_callback: function (editor) {
                window.currentEditor = editor;
                editor.on('focus', function (e) {
                    var totalWidth = document.getElementsByClassName('wptb-builder-panel')[0].offsetWidth;
                    if (window.currentEditor &&
                        document.getElementById('wptb_builder').scrollTop >= 55 &&
                        window.currentEditor.bodyElement.style.display != 'none') {
                        document.getElementById('wpcd_fixed_toolbar').style.position = 'fixed';
                        document.getElementById('wpcd_fixed_toolbar').style.right = (totalWidth / 2 - document.getElementById('wpcd_fixed_toolbar').offsetWidth / 2) + 'px';
                        document.getElementById('wpcd_fixed_toolbar').style.top = '100px';
                    } else {
                        document.getElementById('wpcd_fixed_toolbar').style.position = 'static';
                        delete document.getElementById('wpcd_fixed_toolbar').style.right;
                        delete document.getElementById('wpcd_fixed_toolbar').style.top;
                    }
                });
            }
        });
    },
    linkHttpCheckChange: function( link ) {
        if ( link.indexOf( 'http://' ) == -1 && link.indexOf( 'https://' ) == -1 ) {
            let linkArr = link.split( '/' ),
                linkClean;
            if ( Array.isArray( linkArr ) && linkArr.length > 0 ) {
                linkClean = linkArr[linkArr.length - 1];
            }
            return document.location.protocol + '//' + linkClean;
        } else { 
            return link;
        }
    }
}
