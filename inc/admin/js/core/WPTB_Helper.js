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
    }
}